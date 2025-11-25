import tokens from './tokens';

// Typography utilities and presets
export const typography = {
  // Base text styles
  pageTitle: {
    fontSize: tokens.typography.fontSize['3xl'],
    fontWeight: tokens.typography.fontWeight.semibold,
    lineHeight: tokens.typography.lineHeight.tight,
    color: tokens.colors.text.primary,
    letterSpacing: '-0.02em',
  },

  sectionTitle: {
    fontSize: tokens.typography.fontSize.xl,
    fontWeight: tokens.typography.fontWeight.semibold,
    lineHeight: tokens.typography.lineHeight.tight,
    color: tokens.colors.text.primary,
  },

  cardTitle: {
    fontSize: tokens.typography.fontSize.lg,
    fontWeight: tokens.typography.fontWeight.semibold,
    lineHeight: tokens.typography.lineHeight.normal,
    color: tokens.colors.text.primary,
  },

  subtitle: {
    fontSize: tokens.typography.fontSize.sm,
    fontWeight: tokens.typography.fontWeight.normal,
    lineHeight: tokens.typography.lineHeight.normal,
    color: tokens.colors.text.secondary,
  },

  label: {
    fontSize: tokens.typography.fontSize.sm,
    fontWeight: tokens.typography.fontWeight.medium,
    lineHeight: tokens.typography.lineHeight.normal,
    color: tokens.colors.text.primary,
  },

  body: {
    fontSize: tokens.typography.fontSize.base,
    fontWeight: tokens.typography.fontWeight.normal,
    lineHeight: tokens.typography.lineHeight.normal,
    color: tokens.colors.text.secondary,
  },

  bodySmall: {
    fontSize: tokens.typography.fontSize.sm,
    fontWeight: tokens.typography.fontWeight.normal,
    lineHeight: tokens.typography.lineHeight.normal,
    color: tokens.colors.text.secondary,
  },

  caption: {
    fontSize: tokens.typography.fontSize.xs,
    fontWeight: tokens.typography.fontWeight.normal,
    lineHeight: tokens.typography.lineHeight.normal,
    color: tokens.colors.text.muted,
  },

  buttonText: {
    fontSize: tokens.typography.fontSize.sm,
    fontWeight: tokens.typography.fontWeight.medium,
    lineHeight: tokens.typography.lineHeight.tight,
  },
};

export default typography;
