namespace EquathoraBackend.Models;

public class Problem
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public string Statement { get; set; } = null!;
    public string Topic { get; set; } = null!;
    public int Difficulty { get; set; }
    public string Answer { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
