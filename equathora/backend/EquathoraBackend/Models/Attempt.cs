using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EquathoraBackend.Models;

[Table("attempts")]
public class Attempt
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Column("user_id")]
    public Guid UserId { get; set; }

    [Column("problem_id")]
    public int ProblemId { get; set; }

    [Column("is_correct")]
    public bool IsCorrect { get; set; }

    [Column("time_spent_seconds")]
    public int TimeSpentSeconds { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
