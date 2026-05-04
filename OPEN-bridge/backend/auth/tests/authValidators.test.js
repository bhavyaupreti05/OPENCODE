const { signupSchema, loginSchema, refreshTokenSchema } = require('../validators/authValidators');

describe('Auth validation', () => {
  test('signup validation succeeds with valid data', () => {
    const { error } = signupSchema.validate({
      email: 'user@example.com',
      password: 'Password1',
      confirmPassword: 'Password1'
    });

    expect(error).toBeUndefined();
  });

  test('signup validation fails when password rules are not met', () => {
    const { error } = signupSchema.validate({
      email: 'user@example.com',
      password: 'password',
      confirmPassword: 'password'
    });

    expect(error).toBeDefined();
    expect(error.details[0].message).toContain('Password must contain at least one lowercase letter, one uppercase letter, and one number');
  });

  test('login validation fails without password', () => {
    const { error } = loginSchema.validate({ email: 'user@example.com' });
    expect(error).toBeDefined();
    expect(error.details[0].message).toContain('Password is required');
  });

  test('refresh token validation fails when token is missing', () => {
    const { error } = refreshTokenSchema.validate({});
    expect(error).toBeDefined();
    expect(error.details[0].message).toContain('Token is required');
  });
});
