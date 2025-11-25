import tokens from './tokens';

// Global theme configuration
export const theme = {
  ...tokens,
  
  // Component-specific defaults
  components: {
    button: {
      height: {
        sm: '32px',
        md: '40px',
        lg: '48px',
      },
      padding: {
        sm: '0 12px',
        md: '0 20px',
        lg: '0 28px',
      },
    },
    
    input: {
      height: {
        sm: '32px',
        md: '40px',
        lg: '48px',
      },
      padding: '0 12px',
    },
    
    card: {
      padding: tokens.spacing.lg,
      borderRadius: tokens.borderRadius.xl,
      shadow: tokens.shadows.sm,
    },
    
    table: {
      headerHeight: '44px',
      rowHeight: '52px',
    },
  },
  
  // Layout constraints
  layout: {
    sidebarWidth: '260px',
    sidebarCollapsedWidth: '72px',
    headerHeight: '64px',
    maxContentWidth: '1440px',
    contentPadding: tokens.spacing.xl,
  },
};

export default theme;
