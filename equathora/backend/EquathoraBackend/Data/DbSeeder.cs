using EquathoraBackend.Data;
using EquathoraBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace EquathoraBackend.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext db)
    {
        if (db.Problems.Any())
            return;

        var migrationDirectory = FindProblemMigrationDirectory();
        if (migrationDirectory is not null)
        {
            var seedFiles = Directory
                .GetFiles(migrationDirectory, "*.sql", SearchOption.TopDirectoryOnly)
                .OrderBy(path => path, StringComparer.OrdinalIgnoreCase)
                .ToArray();

            foreach (var seedFile in seedFiles)
            {
                var sql = File.ReadAllText(seedFile);
                if (!string.IsNullOrWhiteSpace(sql))
                {
                    db.Database.ExecuteSqlRaw(sql);
                }
            }

            if (db.Problems.Any())
            {
                return;
            }
        }

        db.Problems.AddRange(
            new Problem
            {
                GroupId = 1,
                Title = "Simple Addition",
                Description = "What is $7 + 5$?",
                Difficulty = "Easy",
                Grade = "8",
                Answer = "12",
                Topic = "arithmetic"
            },
            new Problem
            {
                GroupId = 1,
                Title = "Logic Check",
                Description = "Is every square a rectangle?",
                Difficulty = "Easy",
                Grade = "8",
                Answer = "Yes",
                Topic = "logic"
            }
        );

        db.SaveChanges();
    }

    private static string? FindProblemMigrationDirectory()
    {
        var current = new DirectoryInfo(AppContext.BaseDirectory);
        while (current is not null)
        {
            var candidate = Path.Combine(current.FullName, "SQL", "ProblemMigration");
            if (Directory.Exists(candidate))
            {
                return candidate;
            }

            current = current.Parent;
        }

        return null;
    }
}
