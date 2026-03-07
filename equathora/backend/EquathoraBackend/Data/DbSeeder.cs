using EquathoraBackend.Data;
using EquathoraBackend.Models;

namespace EquathoraBackend.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext db)
    {
        if (db.Problems.Any())
            return;

        db.Problems.AddRange(
            new Problem
            {
                GroupId = 1,
                Title = "Simple Addition",
                Description = "What is $7 + 5$?",
                Difficulty = "Easy",
                Answer = "12",
                Topic = "arithmetic"
            },
            new Problem
            {
                GroupId = 1,
                Title = "Logic Check",
                Description = "Is every square a rectangle?",
                Difficulty = "Easy",
                Answer = "Yes",
                Topic = "logic"
            }
        );

        db.SaveChanges();
    }
}
