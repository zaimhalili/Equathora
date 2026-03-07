using Microsoft.EntityFrameworkCore;
using EquathoraBackend.Data;

public static class ProblemEndpoints
{
    public static void MapProblemEndpoints(this WebApplication app)
    {
        app.MapGet("/api/problems", async (AppDbContext db) =>
        {
            return await db.Problems
                .Where(p => p.IsActive)
                .Select(p => new 
                {
                    p.Id,
                    p.Title,
                    p.Description,
                    p.Topic,
                    p.Difficulty,
                    p.Slug
                })
                .ToListAsync();
        });
    }
}
