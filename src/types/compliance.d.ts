/**
 * AI PRD Compliance Agent Data Types
 * Reflects the output structure of Feature 3: AI PRD Compliance Agent
 */

export interface ComplianceRecommendation {
  section: string;
  fix: string;
}

export interface ComplianceData {
  score: number; // Compliance score (0-100)
  latestCommitId: string; // The most recent commit analyzed
  recommendations: ComplianceRecommendation[]; // Detailed recommendations for fixes
  timestamp?: string; // Optional: when the compliance check was performed
  deviations?: string[]; // Optional: list of detected deviations from PRD
}
