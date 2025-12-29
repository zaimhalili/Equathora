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
                Title = "Simple Addition",
                Statement = "What is 7 + 5?",
                Topic = "Arithmetic",
                Difficulty = 1,
                Answer = "12"
            },
            new Problem
            {
                Title = "Logic Check",
                Statement = "Is every square a rectangle?",
                Topic = "Logic",
                Difficulty = 1,
                Answer = "Yes"
            }
        );

        db.SaveChanges();
    }
}
