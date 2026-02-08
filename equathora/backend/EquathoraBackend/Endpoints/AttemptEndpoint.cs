using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using EquathoraBackend.Data;
using EquathoraBackend.Models;
using EquathoraBackend.Contracts;

public static class AttemptEndpoints
{
    public static void MapAttemptEndpoints(this WebApplication app)
    {
        app.MapPost("/api/attempts", CreateAttempt)
            .RequireAuthorization();
    }

    static async Task<IResult> CreateAttempt(
        ClaimsPrincipal user,
        AppDbContext db,
        AttemptRequest req)
    {
        db.Attempts.Add(new Attempt
        {
            UserId = Guid.Parse(user.FindFirstValue("sub")!),
            ProblemId = req.ProblemId,
            IsCorrect = req.IsCorrect,
            TimeSpentSeconds = req.TimeSpentSeconds
        });

        await db.SaveChangesAsync();
        return Results.Ok();
    }
}