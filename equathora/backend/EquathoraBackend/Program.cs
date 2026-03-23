using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using EquathoraBackend.Data;
using EquathoraBackend.Models;
using EquathoraBackend.Contracts;
using AspNetCoreRateLimit;
using MathNet.Numerics;
using MathNet.Numerics.LinearAlgebra;

var builder = WebApplication.CreateBuilder(args);

// DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// JWT config
var jwtSection = builder.Configuration.GetSection("JWT");
var secretKey = jwtSection["SecretKey"] ?? throw new InvalidOperationException("JWT:SecretKey missing");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.MapInboundClaims = false; // keep claim names as issued (sub, email)
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSection["Issuer"],
            ValidAudience = jwtSection["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
            NameClaimType = "sub",
            RoleClaimType = "role"
        };
    });

builder.Services.AddAuthorization();

// Rate limiting configuration
builder.Services.AddMemoryCache();
builder.Services.Configure<IpRateLimitOptions>(options =>
{
    options.EnableEndpointRateLimiting = true;
    options.StackBlockedRequests = false;
    options.HttpStatusCode = 429;
    options.RealIpHeader = "X-Real-IP";
    options.GeneralRules = new List<RateLimitRule>
    {
        new RateLimitRule
        {
            Endpoint = "*/api/auth/*",
            Period = "1m",
            Limit = 10 // Correct property name
        },
        new RateLimitRule
        {
            Endpoint = "*",
            Period = "1m",
            Limit = 100 // Correct property name
        }
    };
});
builder.Services.AddSingleton<IIpPolicyStore, MemoryCacheIpPolicyStore>();
builder.Services.AddSingleton<IRateLimitCounterStore, MemoryCacheRateLimitCounterStore>();
builder.Services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();
builder.Services.AddSingleton<IProcessingStrategy, AsyncKeyLockProcessingStrategy>();

// OpenAPI remains
builder.Services.AddOpenApi();

// CORS — separate policies for dev and production
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactDev", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
    options.AddPolicy("Production", policy =>
    {
        policy.WithOrigins("https://equathora.com", "https://www.equathora.com")
              .WithMethods("GET", "POST", "PUT", "DELETE", "PATCH")
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Enable CORS + auth
if (app.Environment.IsDevelopment())
{
    app.UseCors("AllowReactDev");
}
else
{
    app.UseCors("Production");
    app.UseHttpsRedirection();
}

app.UseAuthentication();
app.UseAuthorization();

// OpenAPI mapping
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Register
app.MapPost("/api/auth/register", async (RegisterRequest req, AppDbContext db) =>
{
    var exists = await db.Users.AnyAsync(u => u.Email == req.Email);
    if (exists) return Results.BadRequest(new { error = "Email already registered" });

    var verificationCode = RandomNumberGenerator.GetInt32(100000, 1000000).ToString();

    var user = new User
    {
        Email = req.Email,
        PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
        Username = req.Username,
        VerificationCode = verificationCode,
        VerificationCodeExpiry = DateTime.UtcNow.AddHours(24),
        CreatedAt = DateTime.UtcNow
    };

    db.Users.Add(user);
    await db.SaveChangesAsync();

    // TODO: Send email with verificationCode
    return Results.Ok(new { message = "Registered. Check your email for verification code." });
});

// Login
app.MapPost("/api/auth/login", async (LoginRequest req, AppDbContext db, IConfiguration config) =>
{
    var user = await db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
    if (user is null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
        return Results.Unauthorized();

    if (!user.IsEmailVerified)
        return Results.BadRequest(new { error = "Please verify your email before logging in" });

    var token = CreateToken(user, config);
    return Results.Ok(new { token });
});

// Verify email
app.MapPost("/api/auth/verify-email", async (VerifyEmailRequest req, AppDbContext db) =>
{
    var user = await db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
    if (user is null)
        return Results.BadRequest(new { error = "User not found" });

    if (user.IsEmailVerified)
        return Results.Ok(new { message = "Email already verified" });

    if (user.VerificationCode != req.Code || user.VerificationCodeExpiry < DateTime.UtcNow)
        return Results.BadRequest(new { error = "Invalid or expired verification code" });

    user.IsEmailVerified = true;
    user.VerificationCode = null;
    user.VerificationCodeExpiry = null;
    await db.SaveChangesAsync();

    return Results.Ok(new { message = "Email verified successfully" });
});

// Resend verification
app.MapPost("/api/auth/resend-verification", async (ResendRequest req, AppDbContext db) =>
{
    var user = await db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
    if (user is null)
        return Results.BadRequest(new { error = "User not found" });

    if (user.IsEmailVerified)
        return Results.Ok(new { message = "Email already verified" });

    var verificationCode = RandomNumberGenerator.GetInt32(100000, 1000000).ToString();
    user.VerificationCode = verificationCode;
    user.VerificationCodeExpiry = DateTime.UtcNow.AddHours(24);
    await db.SaveChangesAsync();

    // TODO: Send email with verificationCode
    return Results.Ok(new { message = "Verification code resent" });
});

// Forgot password - send reset token
app.MapPost("/api/auth/forgot-password", async (ForgotPasswordRequest req, AppDbContext db) =>
{
    var user = await db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
    if (user is null)
        return Results.Ok(new { message = "If the email exists, a reset link has been sent" });

    var resetToken = RandomNumberGenerator.GetInt32(100000, 1000000).ToString();
    user.PasswordResetToken = resetToken;
    user.PasswordResetExpiry = DateTime.UtcNow.AddHours(1);
    await db.SaveChangesAsync();

    // TODO: Send email with resetToken
    return Results.Ok(new { message = "Reset code sent to your email" });
});

// Reset password with token
app.MapPost("/api/auth/reset-password", async (ResetPasswordRequest req, AppDbContext db) =>
{
    var user = await db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
    if (user is null)
        return Results.BadRequest(new { error = "Invalid reset request" });

    if (user.PasswordResetToken != req.Token || user.PasswordResetExpiry < DateTime.UtcNow)
        return Results.BadRequest(new { error = "Invalid or expired reset token" });

    user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.NewPassword);
    user.PasswordResetToken = null;
    user.PasswordResetExpiry = null;
    await db.SaveChangesAsync();

    return Results.Ok(new { message = "Password reset successfully" });
});

// Simple protected endpoint to verify JWT works
app.MapGet("/api/auth/me", [Authorize] (ClaimsPrincipal user) =>
{
    var email = user.FindFirstValue("email");
    var sub = user.FindFirstValue("sub");
    return Results.Ok(new { id = sub, email });
});

app.MapGet("/api/profile", [Authorize] (ClaimsPrincipal user) =>
{
    var email = user.FindFirstValue("email");
    var id = user.FindFirstValue("sub");
    return Results.Ok(new { id, email });
});

// Existing math endpoint
app.MapGet("/mathproblem", () =>
{
    var random = new Random();
    int a = random.Next(1, 100);
    int b = random.Next(1, 100);
    string[] ops = { "+", "-", "*", "/" };
    string op = ops[random.Next(ops.Length)];

    if (op == "/") b = random.Next(1, 20);

    string question = $"{a} {op} {b}";
    double answer = op switch
    {
        "+" => a + b,
        "-" => a - b,
        "*" => a * b,
        "/" => Math.Round((double)a / b, 2),
        _ => 0
    };

    return Results.Ok(new { question, answer });
})
.WithName("GetMathProblem");


app.MapGet("/api/problems", async (
    AppDbContext db,
    ClaimsPrincipal user,
    int? page,
    int? pageSize,
    int? problemId,
    string? slug,
    string? difficulty,
    string? topic,
    string? grade,
    string? status,
    string? progress,
    string? q,
    string? sort) =>
{
    var currentPage = Math.Max(1, page ?? 1);
    var currentPageSize = Math.Clamp(pageSize ?? 50, 1, 100);

    static string[] ParseCsv(string? input) =>
        string.IsNullOrWhiteSpace(input)
            ? Array.Empty<string>()
            : input.Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries);

    var difficultyFilters = ParseCsv(difficulty);
    var topicFilters = ParseCsv(topic);
    var gradeFilters = ParseCsv(grade);
    var statusFilters = ParseCsv(status);
    var progressFilters = ParseCsv(progress);

    var baseQuery = db.Problems
        .AsNoTracking()
        .Where(p => p.IsActive);

    if (problemId.HasValue)
    {
        baseQuery = baseQuery.Where(p => p.Id == problemId.Value);
    }

    if (!string.IsNullOrWhiteSpace(slug))
    {
        var slugFilter = slug.Trim();
        baseQuery = baseQuery.Where(p => p.Slug == slugFilter);
    }

    if (difficultyFilters.Length > 0)
    {
        baseQuery = baseQuery.Where(p => difficultyFilters.Contains(p.Difficulty));
    }

    if (topicFilters.Length > 0)
    {
        baseQuery = baseQuery.Where(p => p.Topic != null && topicFilters.Contains(p.Topic));
    }

    if (gradeFilters.Length > 0)
    {
        var gradeGroupIds = gradeFilters
            .SelectMany(g => g switch
            {
                "8" => new[] { 1 },
                "9" => new[] { 2, 3 },
                "10" => new[] { 4, 5 },
                "11" => new[] { 6, 7 },
                "12" => new[] { 8, 9, 10 },
                _ => Array.Empty<int>()
            })
            .Distinct()
            .ToArray();

        if (gradeGroupIds.Length == 0)
        {
            return Results.Ok(new
            {
                data = Array.Empty<object>(),
                count = 0,
                page = currentPage,
                pageSize = currentPageSize,
                facets = new
                {
                    difficulty = new Dictionary<string, int>(),
                    topic = new Dictionary<string, int>(),
                    grade = new Dictionary<string, int>(),
                    progress = new Dictionary<string, int>()
                }
            });
        }

        baseQuery = baseQuery.Where(p => gradeGroupIds.Contains(p.GroupId));
    }

    if (!string.IsNullOrWhiteSpace(q))
    {
        var term = q.Trim();
        baseQuery = baseQuery.Where(p =>
            EF.Functions.ILike(p.Title, $"%{term}%") ||
            EF.Functions.ILike(p.Description, $"%{term}%") ||
            (p.Topic != null && EF.Functions.ILike(p.Topic, $"%{term}%")));
    }

    var filteredSnapshot = await baseQuery
        .Select(p => new
        {
            p.Id,
            p.GroupId,
            p.Title,
            p.Description,
            p.Topic,
            p.Difficulty,
            p.IsPremium,
            p.Slug,
            p.DisplayOrder,
            p.CreatedAt
        })
        .ToListAsync();

    Guid? userId = null;
    var sub = user.FindFirstValue("sub");
    if (Guid.TryParse(sub, out var parsedUserId))
    {
        userId = parsedUserId;
    }

    HashSet<int> completedSet = new();
    HashSet<int> inProgressSet = new();

    if (userId.HasValue)
    {
        var attemptRows = await db.Attempts
            .AsNoTracking()
            .Where(a => a.UserId == userId.Value)
            .GroupBy(a => a.ProblemId)
            .Select(g => new
            {
                ProblemId = g.Key,
                HasCorrect = g.Any(x => x.IsCorrect),
                HasAttempt = g.Any()
            })
            .ToListAsync();

        completedSet = attemptRows
            .Where(a => a.HasCorrect)
            .Select(a => a.ProblemId)
            .ToHashSet();

        inProgressSet = attemptRows
            .Where(a => !a.HasCorrect && a.HasAttempt)
            .Select(a => a.ProblemId)
            .ToHashSet();
    }

    bool IncludeByProgressState(int problemId)
    {
        var isCompleted = completedSet.Contains(problemId);
        var isInProgress = inProgressSet.Contains(problemId);

        if (statusFilters.Length > 0)
        {
            var statusMatch = statusFilters.Any(s =>
                (s.Equals("completed", StringComparison.OrdinalIgnoreCase) && isCompleted) ||
                (s.Equals("notstarted", StringComparison.OrdinalIgnoreCase) && !isCompleted && !isInProgress));

            if (!statusMatch) return false;
        }

        if (progressFilters.Length > 0)
        {
            var progressMatch = progressFilters.Any(s =>
                (s.Equals("completed", StringComparison.OrdinalIgnoreCase) && isCompleted) ||
                (s.Equals("in-progress", StringComparison.OrdinalIgnoreCase) && isInProgress) ||
                (s.Equals("not-started", StringComparison.OrdinalIgnoreCase) && !isCompleted && !isInProgress));

            if (!progressMatch) return false;
        }

        return true;
    }

    var filteredWithProgress = filteredSnapshot
        .Where(p => IncludeByProgressState(p.Id))
        .Select(p => new
        {
            p.Id,
            p.GroupId,
            p.Title,
            p.Description,
            p.Topic,
            p.Difficulty,
            p.IsPremium,
            p.Slug,
            p.DisplayOrder,
            p.CreatedAt,
            Completed = completedSet.Contains(p.Id),
            InProgress = inProgressSet.Contains(p.Id)
        })
        .ToList();

    var difficultyFacet = filteredWithProgress
        .GroupBy(p => p.Difficulty)
        .ToDictionary(g => g.Key, g => g.Count());

    var topicFacet = filteredWithProgress
        .Where(p => !string.IsNullOrWhiteSpace(p.Topic))
        .GroupBy(p => p.Topic!)
        .ToDictionary(g => g.Key, g => g.Count());

    string? GradeFromGroupId(int groupId) => groupId switch
    {
        1 => "8",
        2 or 3 => "9",
        4 or 5 => "10",
        6 or 7 => "11",
        8 or 9 or 10 => "12",
        _ => null
    };

    var gradeFacet = filteredWithProgress
        .Select(p => GradeFromGroupId(p.GroupId))
        .Where(g => g != null)
        .GroupBy(g => g!)
        .ToDictionary(g => g.Key, g => g.Count());

    var progressFacet = new Dictionary<string, int>
    {
        ["completed"] = filteredWithProgress.Count(p => p.Completed),
        ["in-progress"] = filteredWithProgress.Count(p => p.InProgress),
        ["not-started"] = filteredWithProgress.Count(p => !p.Completed && !p.InProgress)
    };

    var normalizedSort = (sort ?? string.Empty)
        .Trim()
        .ToLowerInvariant();

    var ordered = normalizedSort switch
    {
        "title-asc" => filteredWithProgress
            .OrderBy(p => p.Title)
            .ThenBy(p => p.GroupId)
            .ThenBy(p => p.DisplayOrder)
            .ThenBy(p => p.Id),
        "title-desc" => filteredWithProgress
            .OrderByDescending(p => p.Title)
            .ThenBy(p => p.GroupId)
            .ThenBy(p => p.DisplayOrder)
            .ThenBy(p => p.Id),
        "difficulty-asc" or "difficulty_asc" => filteredWithProgress
            .OrderBy(p => p.Difficulty == "Easy" ? 0 : p.Difficulty == "Medium" ? 1 : 2)
            .ThenBy(p => p.GroupId)
            .ThenBy(p => p.DisplayOrder)
            .ThenBy(p => p.Id),
        "difficulty-desc" or "difficulty_desc" => filteredWithProgress
            .OrderByDescending(p => p.Difficulty == "Hard" ? 2 : p.Difficulty == "Medium" ? 1 : 0)
            .ThenBy(p => p.GroupId)
            .ThenBy(p => p.DisplayOrder)
            .ThenBy(p => p.Id),
        "newest" => filteredWithProgress
            .OrderByDescending(p => p.CreatedAt)
            .ThenByDescending(p => p.Id),
        "oldest" => filteredWithProgress
            .OrderBy(p => p.CreatedAt)
            .ThenBy(p => p.Id),
        _ => filteredWithProgress
            .OrderBy(p => p.GroupId)
            .ThenBy(p => p.DisplayOrder)
            .ThenBy(p => p.Id)
    };

    var totalCount = filteredWithProgress.Count;
    var pagedData = ordered
        .Skip((currentPage - 1) * currentPageSize)
        .Take(currentPageSize)
        .Select(p => new
        {
            id = p.Id,
            group_id = p.GroupId,
            title = p.Title,
            description = p.Description,
            topic = p.Topic,
            difficulty = p.Difficulty,
            premium = p.IsPremium,
            slug = p.Slug,
            completed = p.Completed,
            inProgress = p.InProgress
        })
        .ToList();

    return Results.Ok(new
    {
        data = pagedData,
        count = totalCount,
        page = currentPage,
        pageSize = currentPageSize,
        facets = new
        {
            difficulty = difficultyFacet,
            topic = topicFacet,
            grade = gradeFacet,
            progress = progressFacet
        }
    });
});

app.MapPost("/api/attempts", [Authorize] async (
    ClaimsPrincipal user,
    AppDbContext db,
    AttemptRequest req) =>
{
    var userId = Guid.Parse(user.FindFirstValue("sub")!);

    var problem = await db.Problems.FindAsync(req.ProblemId);
    if (problem is null)
        return Results.NotFound();

    var isCorrect =
        string.Equals(problem.Answer.Trim(), req.UserAnswer.Trim(), StringComparison.OrdinalIgnoreCase);

    var attempt = new Attempt
    {
        UserId = userId,
        ProblemId = problem.Id,
        IsCorrect = isCorrect,
        TimeSpentSeconds = req.TimeSpentSeconds
    };

    db.Attempts.Add(attempt);
    await db.SaveChangesAsync();

    return Results.Ok(new { isCorrect });
});

// Sync Supabase/External user into local DB (upsert)
app.MapPost("/api/users/sync", async (UserSyncRequest req, AppDbContext db, IConfiguration config, HttpRequest http) =>
{
    // Shared-secret validation
    var shared = config["BackendSharedSecret"];
    if (string.IsNullOrEmpty(shared) || !http.Headers.TryGetValue("X-Backend-Secret", out var provided) || provided != shared)
        return Results.Unauthorized();

    if (req.Id == Guid.Empty || string.IsNullOrEmpty(req.Email))
        return Results.BadRequest(new { error = "Invalid payload" });

    var user = await db.Users.FindAsync(req.Id);
    if (user == null)
    {
        user = new User
        {
            Id = req.Id,
            Email = req.Email,
            Username = req.Username,
            GoogleId = req.Provider == "google" ? req.ProviderId : null,
            IsEmailVerified = req.IsEmailVerified,
            CreatedAt = DateTime.UtcNow
        };
        db.Users.Add(user);
    }
    else
    {
        user.Email = req.Email;
        user.Username = req.Username ?? user.Username;
        if (req.Provider == "google") user.GoogleId = req.ProviderId ?? user.GoogleId;
        user.IsEmailVerified = req.IsEmailVerified;
    }

    // Ensure stats row exists
    var stats = await db.UserStats.FirstOrDefaultAsync(s => s.UserId == req.Id);
    if (stats == null)
    {
        stats = new UserStats { UserId = req.Id, CreatedAt = DateTime.UtcNow };
        db.UserStats.Add(stats);
    }

    await db.SaveChangesAsync();

    return Results.Ok(new { message = "User synced" });
});

// Accept attempt sync (used when frontend uses backend for saving solves)
app.MapPost("/api/users/{userId:guid}/attempts/sync", async (Guid userId, AttemptRequest req, AppDbContext db, IConfiguration config, HttpRequest http) =>
{
    var shared = config["BackendSharedSecret"];
    if (string.IsNullOrEmpty(shared) || !http.Headers.TryGetValue("X-Backend-Secret", out var provided) || provided != shared)
        return Results.Unauthorized();

    var user = await db.Users.FindAsync(userId);
    if (user == null) return Results.NotFound(new { error = "User not found" });

    var problem = await db.Problems.FindAsync(req.ProblemId);
    if (problem == null) return Results.NotFound(new { error = "Problem not found" });

    var isCorrect = string.Equals(problem.Answer.Trim(), req.UserAnswer.Trim(), StringComparison.OrdinalIgnoreCase);

    var attempt = new Attempt
    {
        UserId = userId,
        ProblemId = problem.Id,
        IsCorrect = isCorrect,
        TimeSpentSeconds = req.TimeSpentSeconds,
        CreatedAt = DateTime.UtcNow
    };
    db.Attempts.Add(attempt);

    var stats = await db.UserStats.FirstOrDefaultAsync(s => s.UserId == userId);
    if (stats == null)
    {
        stats = new UserStats { UserId = userId, CreatedAt = DateTime.UtcNow };
        db.UserStats.Add(stats);
    }

    stats.Attempts += 1;
    if (isCorrect)
    {
        stats.ProblemsSolved += 1;
        stats.CorrectAttempts += 1;

        // streak logic: increment if last solved within 1 day, else reset
        if (stats.LastSolvedAt.HasValue && (DateTime.UtcNow - stats.LastSolvedAt.Value).TotalDays <= 1)
            stats.CurrentStreak += 1;
        else
            stats.CurrentStreak = 1;

        if (stats.CurrentStreak > stats.LongestStreak) stats.LongestStreak = stats.CurrentStreak;

        stats.Reputation += 10;
    }
    else
    {
        // incorrect attempt reduces reputation slightly and resets streak
        stats.Reputation = Math.Max(0, stats.Reputation - 2);
        stats.CurrentStreak = 0;
    }

    stats.LastSolvedAt = DateTime.UtcNow;

    await db.SaveChangesAsync();

    return Results.Ok(new { isCorrect, stats });
});

// Get user stats
app.MapGet("/api/users/{userId:guid}/stats", async (Guid userId, AppDbContext db) =>
{
    var stats = await db.UserStats.FirstOrDefaultAsync(s => s.UserId == userId);
    if (stats == null) return Results.NotFound();
    return Results.Ok(stats);
});


// Helper functions and DTOs
static string CreateToken(User user, IConfiguration config)
{
    var jwt = config.GetSection("JWT");
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["SecretKey"]!));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
    var expires = DateTime.UtcNow.AddMinutes(int.Parse(jwt["ExpirationMinutes"] ?? "60"));

    var claims = new[]
    {
        new Claim("sub", user.Id.ToString()),
        new Claim("email", user.Email)
    };

    var token = new JwtSecurityToken(
        issuer: jwt["Issuer"],
        audience: jwt["Audience"],
        claims: claims,
        expires: expires,
        signingCredentials: creds);

    return new JwtSecurityTokenHandler().WriteToken(token);
}

using (var scope = app.Services.CreateScope())
{
    var loggerFactory = scope.ServiceProvider.GetRequiredService<ILoggerFactory>();
    var logger = loggerFactory.CreateLogger("StartupCheck");
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        // quick connectivity check
        try
        {
            await db.Database.OpenConnectionAsync();
            await db.Database.CloseConnectionAsync();
            logger.LogInformation("Database connection successful.");
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Unable to open database connection at startup. Check connection string and network access.");
        }

        // run seeder in a try/catch so startup won't crash if DB isn't ready
        try
        {
            DbSeeder.Seed(db);
            logger.LogInformation("Database seeding completed (if any).");
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Seeding failed or skipped.");
        }
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Unexpected error during startup checks");
    }
}


app.Run();