namespace EquathoraBackend.Contracts;

// Auth
public record RegisterRequest(
    string Email,
    string Password,
    string Username
);

public record LoginRequest(
    string Email,
    string Password
);

public record VerifyEmailRequest(
    string Email,
    string Code
);

public record ResendRequest(
    string Email
);
