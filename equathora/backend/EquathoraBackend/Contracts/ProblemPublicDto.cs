namespace EquathoraBackend.Contracts;

public record ProblemPublicDto(
    Guid Id,
    string Title,
    string Statement,
    string Topic,
    int Difficulty
);
