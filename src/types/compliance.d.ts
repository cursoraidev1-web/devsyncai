/**
 * TypeScript definitions for AI PRD Compliance Agent
 * Reflects the output structure of Feature 3: AI PRD Compliance Agent
 */

/**
 * Represents a recommendation for fixing PRD compliance issues
 */
export interface ComplianceRecommendation {
  /** The PRD section or requirement that needs attention */
  section: string;
  /** Suggested fix or action to achieve compliance */
  fix: string;
}

/**
 * Complete compliance audit data from the AI PRD Compliance Agent
 */
export interface ComplianceData {
  /** Compliance score (0-100) indicating alignment with approved PRD */
  score: number;
  /** The most recent commit ID that was audited */
  latestCommitId: string;
  /** Array of detailed recommendations for fixing deviations */
  recommendations: ComplianceRecommendation[];
  /** Timestamp of when this compliance check was performed */
  lastChecked?: string;
  /** Optional: PRD version being validated against */
  prdVersion?: string;
}
