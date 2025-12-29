// Design System Tokens
// All design values centralized for consistency

export const tokens = {
  // Colors
  colors: {
    primary: '#8409BD',
    primaryHover: '#6B0898',
    primarySoft: '#F3E5F5',
    
    background: '#F5F7FA',
    surface: '#FFFFFF',
    surfaceAlt: '#F0F2F5',
    
    border: '#E4E7EB',
    divider: '#EDF2F7',
    
    text: {
      primary: '#1A1F36',
      secondary: '#4A5568',
      muted: '#718096',
    },
    
    status: {
      error: '#E53E3E',
      warning: '#DD6B20',
      success: '#38A169',
      info: '#3182CE',
    },
    
    sidebar: {
      bg: '#0B1020',
      active: '#1D2336',
      text: '#A0AEC0',
      textActive: '#FFFFFF',
    }
  },

  // Spacing Scale (in px)
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },

  // Typography
  typography: {
    fontFamily: {
      base: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", "Satoshi", sans-serif',
      mono: 'Monaco, Consolas, "Courier New", monospace',
    },
    
    fontSize: {
      xs: '11px',
      sm: '13px',
      base: '14px',
      md: '15px',
      lg: '16px',
      xl: '18px',
      '2xl': '20px',
      '3xl': '24px',
      '4xl': '28px',
      '5xl': '32px',
    },
    
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.7,
    },
  },

  // Border Radius
  borderRadius: {
    sm: '6px',
    base: '8px',
    lg: '10px',
    xl: '12px',
    '2xl': '16px',
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },

  // Transitions
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Z-Index Scale
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
};

export default tokens;
