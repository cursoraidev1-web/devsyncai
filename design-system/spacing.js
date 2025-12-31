import tokens from './tokens';

// Spacing utilities based on design tokens
export const spacing = {
  // Padding utilities
  p: (size) => ({ padding: tokens.spacing[size] }),
  px: (size) => ({ paddingLeft: tokens.spacing[size], paddingRight: tokens.spacing[size] }),
  py: (size) => ({ paddingTop: tokens.spacing[size], paddingBottom: tokens.spacing[size] }),
  pt: (size) => ({ paddingTop: tokens.spacing[size] }),
  pb: (size) => ({ paddingBottom: tokens.spacing[size] }),
  pl: (size) => ({ paddingLeft: tokens.spacing[size] }),
  pr: (size) => ({ paddingRight: tokens.spacing[size] }),

  // Margin utilities
  m: (size) => ({ margin: tokens.spacing[size] }),
  mx: (size) => ({ marginLeft: tokens.spacing[size], marginRight: tokens.spacing[size] }),
  my: (size) => ({ marginTop: tokens.spacing[size], marginBottom: tokens.spacing[size] }),
  mt: (size) => ({ marginTop: tokens.spacing[size] }),
  mb: (size) => ({ marginBottom: tokens.spacing[size] }),
  ml: (size) => ({ marginLeft: tokens.spacing[size] }),
  mr: (size) => ({ marginRight: tokens.spacing[size] }),

  // Gap utilities
  gap: (size) => ({ gap: tokens.spacing[size] }),
  gapX: (size) => ({ columnGap: tokens.spacing[size] }),
  gapY: (size) => ({ rowGap: tokens.spacing[size] }),
};

export default spacing;
