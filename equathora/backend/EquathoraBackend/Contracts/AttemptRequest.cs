namespace EquathoraBackend.Contracts;

public record AttemptRequest(
    Guid ProblemId,
    string UserAnswer,
    bool IsCorrect,
    int TimeSpentSeconds
);
