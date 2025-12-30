namespace EquathoraBackend.Models;

public class UserStats
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }

    // Aggregates
    public int ProblemsSolved { get; set; }
    public int Attempts { get; set; }
    public int CorrectAttempts { get; set; }
    public int CurrentStreak { get; set; }
    public int LongestStreak { get; set; }
    public int Reputation { get; set; }

    public DateTime? LastSolvedAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
