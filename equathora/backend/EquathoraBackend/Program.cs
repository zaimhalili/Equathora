using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using EquathoraBackend.Data;
using EquathoraBackend.Models;


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

// OpenAPI remains
builder.Services.AddOpenApi();

// ✅ Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactDev", policy =>
    {
        policy.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();

// Enable CORS + auth
app.UseCors("AllowReactDev");
app.UseAuthentication();
app.UseAuthorization();

// Optional: comment out HTTPS redirect for dev
// app.UseHttpsRedirection();

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

    var verificationCode = new Random().Next(100000, 999999).ToString();
    
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
    return Results.Ok(new { message = "Registered. Check your email for verification code.", code = verificationCode });
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

    var verificationCode = new Random().Next(100000, 999999).ToString();
    user.VerificationCode = verificationCode;
    user.VerificationCodeExpiry = DateTime.UtcNow.AddHours(24);
    await db.SaveChangesAsync();

    // TODO: Send email with verificationCode
    return Results.Ok(new { message = "Verification code resent", code = verificationCode });
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

app.Run();

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

record RegisterRequest(string Email, string Password, string Username);
record LoginRequest(string Email, string Password);
record VerifyEmailRequest(string Email, string Code);
record ResendRequest(string Email);