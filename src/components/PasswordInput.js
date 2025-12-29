import React, { useState } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { validatePassword, checkPasswordRequirements } from '../utils/passwordValidation';
import './PasswordInput.css';

/**
 * Password Input Component with Requirements Display
 * @param {Object} props
 * @param {string} props.value - Password value
 * @param {Function} props.onChange - Change handler
 * @param {boolean} props.showRequirements - Show requirements checklist
 * @param {string} props.placeholder - Input placeholder
 * @param {boolean} props.required - Is field required
 * @param {boolean} props.disabled - Is field disabled
 * @param {string} props.className - Additional CSS classes
 */
const PasswordInput = ({
  value = '',
  onChange,
  showRequirements = true,
  placeholder = 'Enter password',
  required = false,
  disabled = false,
  className = '',
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);
  
  const validation = validatePassword(value);
  const requirements = checkPasswordRequirements(value);
  const showRequirementsList = showRequirements && (focused || value.length > 0);

  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const RequirementItem = ({ met, text }) => (
    <div className={`password-requirement ${met ? 'met' : 'unmet'}`}>
      {met ? (
        <Check size={14} className="requirement-icon check" />
      ) : (
        <X size={14} className="requirement-icon cross" />
      )}
      <span>{text}</span>
    </div>
  );

  return (
    <div className={`password-input-wrapper ${className}`}>
      <div className="password-input-container">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`password-input ${!validation.valid && value ? 'invalid' : ''}`}
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="password-toggle"
          disabled={disabled}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {showRequirementsList && (
        <div className="password-requirements">
          <p className="requirements-title">Password Requirements:</p>
          <div className="requirements-list">
            <RequirementItem
              met={requirements.minLength}
              text="At least 12 characters"
            />
            <RequirementItem
              met={requirements.hasUppercase}
              text="One uppercase letter (A-Z)"
            />
            <RequirementItem
              met={requirements.hasLowercase}
              text="One lowercase letter (a-z)"
            />
            <RequirementItem
              met={requirements.hasNumber}
              text="One number (0-9)"
            />
            <RequirementItem
              met={requirements.hasSpecial}
              text="One special character (!@#$%^&*...)"
            />
            <RequirementItem
              met={requirements.noSpaces}
              text="No spaces"
            />
          </div>
        </div>
      )}

      {value && !validation.valid && (
        <div className="password-errors">
          {validation.errors.map((error, i) => (
            <div key={i} className="password-error">
              • {error}
            </div>
          ))}
        </div>
      )}

      {value && validation.valid && (
        <div className="password-valid">
          <Check size={16} />
          <span>Password meets all requirements</span>
        </div>
      )}
    </div>
  );
};

export default PasswordInput;

