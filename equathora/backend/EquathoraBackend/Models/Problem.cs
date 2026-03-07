using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EquathoraBackend.Models;

[Table("problems")]
public class Problem
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("group_id")]
    public int GroupId { get; set; }

    [Column("title")]
    public string Title { get; set; } = null!;

    [Column("difficulty")]
    public string Difficulty { get; set; } = null!;

    [Column("description")]
    public string Description { get; set; } = null!;

    [Column("answer")]
    public string Answer { get; set; } = null!;

    [Column("accepted_answers")]
    public string[]? AcceptedAnswers { get; set; }

    [Column("hints")]
    public string[]? Hints { get; set; }

    [Column("solution")]
    public string? Solution { get; set; }

    [Column("is_premium")]
    public bool IsPremium { get; set; } = false;

    [Column("topic")]
    public string? Topic { get; set; }

    [Column("display_order")]
    public int DisplayOrder { get; set; } = 0;

    [Column("is_active")]
    public bool IsActive { get; set; } = true;

    [Column("slug")]
    public string? Slug { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
