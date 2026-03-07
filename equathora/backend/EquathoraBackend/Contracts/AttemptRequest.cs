namespace EquathoraBackend.Contracts;

public record AttemptRequest(
    int ProblemId,
    string UserAnswer,
    bool IsCorrect,
    int TimeSpentSeconds
);
