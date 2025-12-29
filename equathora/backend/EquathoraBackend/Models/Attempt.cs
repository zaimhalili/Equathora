namespace EquathoraBackend.Models;

public class Attempt
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid ProblemId { get; set; }
    public bool IsCorrect { get; set; }
    public int TimeSpentSeconds { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
