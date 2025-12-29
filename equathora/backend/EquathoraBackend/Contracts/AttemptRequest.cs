namespace EquathoraBackend.Contracts;

public record AttemptRequest(
    Guid ProblemId,
    string UserAnswer,
    int TimeSpentSeconds
);
