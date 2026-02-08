using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using EquathoraBackend.Data;
using EquathoraBackend.Models;
using EquathoraBackend.Contracts;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this WebApplication app)
    {
        app.MapPost("/api/auth/register", Register);
        app.MapPost("/api/auth/login", Login);
        app.MapPost("/api/auth/verify-email", VerifyEmail);
        app.MapPost("/api/auth/resend-verification", Resend);
        app.MapGet("/api/auth/me", Me).RequireAuthorization();
    }

    static async Task<IResult> Register(RegisterRequest req, AppDbContext db)
    {
        if (await db.Users.AnyAsync(u => u.Email == req.Email))
            return Results.BadRequest(new { error = "Email already registered" });

        var code = Random.Shared.Next(100000, 999999).ToString();

        db.Users.Add(new User
        {
            Email = req.Email,
            Username = req.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
            VerificationCode = code,
            VerificationCodeExpiry = DateTime.UtcNow.AddHours(24),
            CreatedAt = DateTime.UtcNow
        });

        await db.SaveChangesAsync();
        return Results.Ok(new { message = "Registered", code });
    }

    static async Task<IResult> Login(LoginRequest req, AppDbContext db, IConfiguration config)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
        if (user is null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            return Results.Unauthorized();

        if (!user.IsEmailVerified)
            return Results.BadRequest(new { error = "Verify email first" });

        return Results.Ok(new { token = JwtHelper.CreateToken(user, config) });
    }

    static async Task<IResult> VerifyEmail(VerifyEmailRequest req, AppDbContext db)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
        if (user is null) return Results.BadRequest();

        if (user.VerificationCode != req.Code ||
            user.VerificationCodeExpiry < DateTime.UtcNow)
            return Results.BadRequest();

        user.IsEmailVerified = true;
        user.VerificationCode = null;
        user.VerificationCodeExpiry = null;
        await db.SaveChangesAsync();

        return Results.Ok();
    }

    static async Task<IResult> Resend(ResendRequest req, AppDbContext db)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
        if (user is null) return Results.BadRequest();

        user.VerificationCode = Random.Shared.Next(100000, 999999).ToString();
        user.VerificationCodeExpiry = DateTime.UtcNow.AddHours(24);
        await db.SaveChangesAsync();

        return Results.Ok();
    }

    static IResult Me(ClaimsPrincipal user)
        => Results.Ok(new
        {
            id = user.FindFirstValue("sub"),
            email = user.FindFirstValue("email")
        });
}
