export type JobStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED" | "REQUIRES_REVIEW";

export type DiscrepancyCategory =
  | "VALUE_MISMATCH"
  | "MISSING_RECORD"
  | "EXTRA_RECORD"
  | "DUPLICATE_RECORD"
  | "CALCULATION_ERROR"
  | "CURRENCY_MISMATCH"
  | "FIELD_MAPPING_UNCERTAIN"
  | "BUSINESS_RULE_VIOLATION"
  | "AI_REVIEW_CONFLICT";

export type VerificationDecision =
  | "VERIFIED"
  | "CONFIRMED_MISMATCH"
  | "HUMAN_REVIEW_REQUIRED"
  | "ACCEPTED_BY_HUMAN"
  | "QUERIED_BY_HUMAN"
  | "DISMISSED_BY_HUMAN";

export type AIReviewResult = "PASS" | "MISMATCH" | "UNCERTAIN" | "CONFLICT";

export type ConsensusResult = "CONFIRMED_MISMATCH" | "VERIFIED" | "HUMAN_REVIEW_REQUIRED" | "CONFLICT";

export type HumanReviewDecision = "PENDING" | "ACCEPTED" | "QUERY_RAISED" | "DISMISSED";

export type FieldGroup = "REFERENCE" | "SHIPMENT" | "CARGO" | "CHARGES" | "COMMERCIAL";

export interface VerificationJob {
  id: string;
  jobCode: string;
  status: JobStatus;
  progressPercent: number;
  totalRecords: number;
  matchedCount: number;
  mismatchedCount: number;
  missingCount: number;
  extraCount: number;
  duplicateCount: number;
  humanReviewCount: number;
  createdAt: string;
  completedAt?: string;
}

export interface VerificationSummary {
  jobId: string;
  jobCode: string;
  status: string;
  totalRecords: number;
  matchedCount: number;
  mismatchedCount: number;
  missingCount: number;
  extraCount: number;
  duplicateCount: number;
  humanReviewCount: number;
  totalDisputedAmount: number;
  currency: string;
  summaryNotes: string;
}

export interface Discrepancy {
  id: string;
  jobId: string;
  recordReference: string;
  fieldName: string;
  fieldGroup: FieldGroup;
  discrepancyCategory: DiscrepancyCategory;
  databaseValue: string;
  soaValue: string;
  varianceAmount: number;
  variancePercent: number;
  currency: string;
  ruleCode: string;
  ruleDescription: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  deterministicResult: "PASS" | "MISMATCH";
  reviewer1Result: AIReviewResult;
  reviewer2Result: AIReviewResult;
  consensusResult: ConsensusResult;
  humanReviewRequired: boolean;
  humanReviewStatus: HumanReviewDecision;
  humanReviewer?: string;
  humanReviewNotes?: string;
  finalDecision: VerificationDecision;
  aiExplanation: string;
}

export interface VerificationStep {
  id: string;
  jobId: string;
  stepNumber: number;
  stageName: string;
  status: "SUCCESS" | "WARNING" | "ERROR" | "SKIPPED";
  details: string;
  durationMs: number;
  timestamp: string;
}

export interface FieldRegistryItem {
  id: string;
  canonicalName: string;
  fieldGroup: FieldGroup;
  displayName: string;
  dataType: string;
  isRequired: boolean;
  isChargeHead: boolean;
  aliasesJson?: string;
  isCustom: boolean;
}

export interface QueryDraft {
  subject: string;
  greeting: string;
  bodyText: string;
  itemizedTableMarkdown: string;
  closingText: string;
  fullDraft: string;
}
