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
  const requirements = {
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
    notCommon: true
  };

  if (!password) {
    errors.push("Password is required");
    return { valid: false, errors, requirements };
  }

  if (password.length >= 8) {
    requirements.length = true;
  } else {
    errors.push("Password must be at least 8 characters");
  }

  if (/[a-z]/.test(password)) {
    requirements.lowercase = true;
  } else {
    errors.push("Password must include a lowercase letter");
  }

  if (/[A-Z]/.test(password)) {
    requirements.uppercase = true;
  } else {
    errors.push("Password must include an uppercase letter");
  }

  if (/\d/.test(password)) {
    requirements.number = true;
  } else {
    errors.push("Password must include a number");
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    requirements.special = true;
  } else {
    errors.push("Password must include a special character");
  }

  if ([...commonPasswords].some(common => password.toLowerCase().includes(common))) {
    requirements.notCommon = false;
    errors.push("Password can be easily guessed. Avoid common words or patterns.");
  }

  return {
    valid: errors.length === 0,
    errors,
    requirements
  };
}