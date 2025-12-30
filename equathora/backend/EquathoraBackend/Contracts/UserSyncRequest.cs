namespace EquathoraBackend.Contracts;

public record UserSyncRequest(
    Guid Id,
    string Email,
    string? Username,
    string? Provider,
    string? ProviderId,
    bool IsEmailVerified
);
