using Microsoft.EntityFrameworkCore;
using EquathoraBackend.Data;

public static class ProblemEndpoints
{
    public static void MapProblemEndpoints(this WebApplication app)
    {
        app.MapGet("/api/problems", async (AppDbContext db) =>
        {
            return await db.Problems
                .Select(p => new 
                {
                    p.Id,
                    p.Title,
                    p.Statement,
                    p.Topic,
                    p.Difficulty
                })
                .ToListAsync();
        });
    }
}
