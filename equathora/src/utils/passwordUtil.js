const commonPasswords = new Set([
  "password",
  "123456",
  "123456789",
  "qwerty",
  "abc123",
  "password1",
  "111111",
  "123123",
  "admin",
  "test"
]);

export function validatePassword(password) {
  const errors = [];

  if (!password) {
    errors.push("Password is required");
    return { valid: false, errors };
  }

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must include a lowercase letter");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must include an uppercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must include a number");
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push("Password must include a special character");
  }

 if ([...commonPasswords].some(common => password.toLowerCase().includes(common))) {
  errors.push("Password can be easily guessed. Avoid common words or patterns.");
 }

  return {
    valid: errors.length === 0,
    errors
  };
}