/**
 * Password Validation Utility
 * Validates passwords according to backend security requirements
 */

/**
 * Validate password against security requirements
 * @param {string} password - Password to validate
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export const validatePassword = (password) => {
  const errors = [];

  if (!password) {
    return { valid: false, errors: ['Password is required'] };
  }

  if (password.length < 12) {
    errors.push('Password must be at least 12 characters');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;\':"\\,.<>/?');
  }

  if (password.includes(' ')) {
    errors.push('Password cannot contain spaces');
  }

  // Check for common patterns
  const commonPatterns = [
    '123456',
    'password',
    'qwerty',
    'abc123',
    'password123',
    'admin',
    'letmein',
    'welcome',
    'monkey',
    '123456789',
    '12345678',
    '1234567890'
  ];
  
  const lowerPwd = password.toLowerCase();
  const containsCommonPattern = commonPatterns.some(pattern => 
    lowerPwd.includes(pattern) || 
    lowerPwd === pattern ||
    lowerPwd.startsWith(pattern) ||
    lowerPwd.endsWith(pattern)
  );

  if (containsCommonPattern) {
    errors.push('Password cannot contain common patterns or dictionary words');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Check individual password requirements (for UI display)
 * @param {string} password - Password to check
 * @returns {Object} Requirements status
 */
export const checkPasswordRequirements = (password) => {
  if (!password) {
    return {
      minLength: false,
      hasUppercase: false,
      hasLowercase: false,
      hasNumber: false,
      hasSpecial: false,
      noSpaces: false,
    };
  }

  return {
    minLength: password.length >= 12,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    noSpaces: !password.includes(' '),
  };
};

