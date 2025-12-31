import { validatePassword, checkPasswordRequirements } from '../passwordValidation';

describe('passwordValidation', () => {
  describe('validatePassword', () => {
    it('should return valid: false for empty password', () => {
      const result = validatePassword('');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password is required');
    });

    it('should return valid: false for null/undefined password', () => {
      const result = validatePassword(null);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password is required');
    });

    it('should return valid: false for password shorter than 12 characters', () => {
      const result = validatePassword('Short1!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must be at least 12 characters');
    });

    it('should return valid: false for password without uppercase letter', () => {
      const result = validatePassword('lowercase123!@#');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('should return valid: false for password without lowercase letter', () => {
      const result = validatePassword('UPPERCASE123!@#');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });

    it('should return valid: false for password without number', () => {
      const result = validatePassword('NoNumbers!@#');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });

    it('should return valid: false for password without special character', () => {
      const result = validatePassword('NoSpecial123');
      expect(result.valid).toBe(false);
      expect(result.errors.some(err => err.includes('Password must contain at least one special character'))).toBe(true);
    });

    it('should return valid: false for password with spaces', () => {
      const result = validatePassword('Valid Pass123!@#');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password cannot contain spaces');
    });

    it('should return valid: false for password containing common patterns', () => {
      const result = validatePassword('password123!@#');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password cannot contain common patterns or dictionary words');
    });

    it('should return valid: true for a strong password', () => {
      const result = validatePassword('StrongP@ssw0rd!');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return multiple errors for a weak password', () => {
      const result = validatePassword('weak');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe('checkPasswordRequirements', () => {
    it('should return all false for empty password', () => {
      const result = checkPasswordRequirements('');
      expect(result.minLength).toBe(false);
      expect(result.hasUppercase).toBe(false);
      expect(result.hasLowercase).toBe(false);
      expect(result.hasNumber).toBe(false);
      expect(result.hasSpecial).toBe(false);
      expect(result.noSpaces).toBe(false);
    });

    it('should correctly identify minLength requirement', () => {
      const short = checkPasswordRequirements('Short1!');
      expect(short.minLength).toBe(false);

      const long = checkPasswordRequirements('LongEnough123!');
      expect(long.minLength).toBe(true);
    });

    it('should correctly identify uppercase requirement', () => {
      const noUpper = checkPasswordRequirements('lowercase123!');
      expect(noUpper.hasUppercase).toBe(false);

      const hasUpper = checkPasswordRequirements('Uppercase123!');
      expect(hasUpper.hasUppercase).toBe(true);
    });

    it('should correctly identify lowercase requirement', () => {
      const noLower = checkPasswordRequirements('UPPERCASE123!');
      expect(noLower.hasLowercase).toBe(false);

      const hasLower = checkPasswordRequirements('Lowercase123!');
      expect(hasLower.hasLowercase).toBe(true);
    });

    it('should correctly identify number requirement', () => {
      const noNumber = checkPasswordRequirements('NoNumbers!');
      expect(noNumber.hasNumber).toBe(false);

      const hasNumber = checkPasswordRequirements('HasNumber123!');
      expect(hasNumber.hasNumber).toBe(true);
    });

    it('should correctly identify special character requirement', () => {
      const noSpecial = checkPasswordRequirements('NoSpecial123');
      expect(noSpecial.hasSpecial).toBe(false);

      const hasSpecial = checkPasswordRequirements('HasSpecial123!');
      expect(hasSpecial.hasSpecial).toBe(true);
    });

    it('should correctly identify no spaces requirement', () => {
      const hasSpaces = checkPasswordRequirements('Has Spaces123!');
      expect(hasSpaces.noSpaces).toBe(false);

      const noSpaces = checkPasswordRequirements('NoSpaces123!');
      expect(noSpaces.noSpaces).toBe(true);
    });

    it('should return all true for a valid password', () => {
      const result = checkPasswordRequirements('ValidPass123!');
      expect(result.minLength).toBe(true);
      expect(result.hasUppercase).toBe(true);
      expect(result.hasLowercase).toBe(true);
      expect(result.hasNumber).toBe(true);
      expect(result.hasSpecial).toBe(true);
      expect(result.noSpaces).toBe(true);
    });
  });
});


