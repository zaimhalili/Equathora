namespace EquathoraBackend.Contracts;

public record AttemptRequest(
    Guid ProblemId,
    bool IsCorrect,
    int TimeSpentSeconds
);
