namespace EquathoraBackend.Contracts;

public record ProblemPublicDto(
    int Id,
    string Title,
    string Description,
    string Topic,
    string Difficulty,
    string? Slug
);
