import {
  VerificationJob,
  VerificationSummary,
  Discrepancy,
  VerificationStep,
  QueryDraft,
  HumanReviewDecision
} from "../types";

const BASE_URL = "http://localhost:8080/api/v1";

const MOCK_JOBS: VerificationJob[] = [
  {
    id: "job-101",
    jobCode: "JOB-2026-0801",
    status: "REQUIRES_REVIEW",
    progressPercent: 100,
    totalRecords: 12,
    matchedCount: 10,
    mismatchedCount: 2,
    missingCount: 0,
    extraCount: 0,
    duplicateCount: 0,
    humanReviewCount: 2,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    completedAt: new Date().toISOString()
  },
  {
    id: "job-102",
    jobCode: "JOB-2026-0802",
    status: "REQUIRES_REVIEW",
    progressPercent: 100,
    totalRecords: 18,
    matchedCount: 14,
    mismatchedCount: 3,
    missingCount: 1,
    extraCount: 0,
    duplicateCount: 1,
    humanReviewCount: 4,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    completedAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "job-103",
    jobCode: "JOB-2026-0803",
    status: "COMPLETED",
    progressPercent: 100,
    totalRecords: 8,
    matchedCount: 8,
    mismatchedCount: 0,
    missingCount: 0,
    extraCount: 0,
    duplicateCount: 0,
    humanReviewCount: 0,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    completedAt: new Date(Date.now() - 82800000).toISOString()
  }
];

const MOCK_DISCREPANCIES: Discrepancy[] = [
  {
    id: "disc-01",
    jobId: "job-101",
    recordReference: "HBL-SIN-LAX-8801",
    fieldName: "Destination Terminal Handling (D-THC)",
    fieldGroup: "CHARGES",
    discrepancyCategory: "VALUE_MISMATCH",
    databaseValue: "350.00",
    soaValue: "420.00",
    varianceAmount: 70.00,
    variancePercent: 20.00,
    currency: "USD",
    ruleCode: "RULE_TARIFF_01",
    ruleDescription: "Destination THC exceeds agreed contractual tariff ($350.00 USD).",
    severity: "HIGH",
    deterministicResult: "MISMATCH",
    reviewer1Result: "MISMATCH",
    reviewer2Result: "MISMATCH",
    consensusResult: "CONFIRMED_MISMATCH",
    humanReviewRequired: false,
    humanReviewStatus: "PENDING",
    finalDecision: "CONFIRMED_MISMATCH",
    aiExplanation: "Unanimous Consensus (Case 1): Rule Engine, AI Reviewer 1 (Tariff), and AI Reviewer 2 (Operational) confirm +$70.00 USD unagreed destination terminal surcharge."
  },
  {
    id: "disc-02",
    jobId: "job-101",
    recordReference: "HBL-SIN-LAX-8801",
    fieldName: "Demurrage / Detention",
    fieldGroup: "CHARGES",
    discrepancyCategory: "BUSINESS_RULE_VIOLATION",
    databaseValue: "0.00",
    soaValue: "180.00",
    varianceAmount: 180.00,
    variancePercent: 100.00,
    currency: "USD",
    ruleCode: "RULE_AUTH_CHARGE_04",
    ruleDescription: "Demurrage/Detention billed without prior authorization or storage proof.",
    severity: "CRITICAL",
    deterministicResult: "MISMATCH",
    reviewer1Result: "MISMATCH",
    reviewer2Result: "MISMATCH",
    consensusResult: "CONFIRMED_MISMATCH",
    humanReviewRequired: false,
    humanReviewStatus: "PENDING",
    finalDecision: "CONFIRMED_MISMATCH",
    aiExplanation: "Unanimous Consensus (Case 1): Rule Engine, AI Reviewer 1, and AI Reviewer 2 confirm $180.00 USD unauthorized detention fee. No equipment interchange delay receipt attached."
  },
  {
    id: "disc-03",
    jobId: "job-101",
    recordReference: "HBL-SHA-RTM-4412",
    fieldName: "Basic Ocean Freight",
    fieldGroup: "CHARGES",
    discrepancyCategory: "AI_REVIEW_CONFLICT",
    databaseValue: "1850.00",
    soaValue: "1950.00",
    varianceAmount: 100.00,
    variancePercent: 5.41,
    currency: "USD",
    ruleCode: "RULE_TARIFF_01",
    ruleDescription: "Basic ocean freight billed at $1,950.00 vs contract rate $1,850.00.",
    severity: "MEDIUM",
    deterministicResult: "MISMATCH",
    reviewer1Result: "MISMATCH",
    reviewer2Result: "PASS",
    consensusResult: "HUMAN_REVIEW_REQUIRED",
    humanReviewRequired: true,
    humanReviewStatus: "PENDING",
    finalDecision: "HUMAN_REVIEW_REQUIRED",
    aiExplanation: "Consensus Disagreement (Case 3): Reviewer 1 flagged tariff overcharge, while Reviewer 2 suggested potential low-sulphur bunker surcharge bundling. Escalated to Human Reviewer."
  },
  {
    id: "disc-04",
    jobId: "job-101",
    recordReference: "HBL-NSA-HAM-7731",
    fieldName: "Chargeable Weight (KG)",
    fieldGroup: "CARGO",
    discrepancyCategory: "FIELD_MAPPING_UNCERTAIN",
    databaseValue: "21500",
    soaValue: "21500",
    varianceAmount: 0.00,
    variancePercent: 0.00,
    currency: "USD",
    ruleCode: "RULE_WEIGHT_VOL_02",
    ruleDescription: "Deterministic arithmetic matches exactly (21,500 KG).",
    severity: "LOW",
    deterministicResult: "PASS",
    reviewer1Result: "MISMATCH",
    reviewer2Result: "PASS",
    consensusResult: "HUMAN_REVIEW_REQUIRED",
    humanReviewRequired: true,
    humanReviewStatus: "PENDING",
    finalDecision: "HUMAN_REVIEW_REQUIRED",
    aiExplanation: "Deterministic Authority Guard (Case 4): AI Reviewer 1 suspected volumetric ratio mismatch, but Deterministic calculation verified exact equality. Never silently modified; human review requested."
  }
];

const MOCK_STEPS: VerificationStep[] = [
  { id: "step-1", jobId: "job-101", stepNumber: 1, stageName: "1. File Ingestion & Format Check", status: "SUCCESS", details: "Pricing DB (CSV) and Agent SOA (CSV) format validated.", durationMs: 35, timestamp: "12:00:01" },
  { id: "step-2", jobId: "job-101", stepNumber: 2, stageName: "2. Data Extraction & Parsing", status: "SUCCESS", details: "Extracted 12 pricing rows and 12 SOA line items successfully.", durationMs: 50, timestamp: "12:00:02" },
  { id: "step-3", jobId: "job-101", stepNumber: 3, stageName: "3. Field Mapping & Canonical Association", status: "SUCCESS", details: "Mapped 18 columns with 94.2% AI confidence against Field Registry.", durationMs: 120, timestamp: "12:00:03" },
  { id: "step-4", jobId: "job-101", stepNumber: 4, stageName: "4. Data Normalization (ISO / Currency)", status: "SUCCESS", details: "Sanitized currency codes, standard dates (ISO 8601), and trimmed reference IDs.", durationMs: 45, timestamp: "12:00:04" },
  { id: "step-5", jobId: "job-101", stepNumber: 5, stageName: "5. Record Matching (BL / Container)", status: "SUCCESS", details: "Exact key matching on Bill of Lading (HBL) succeeded for 10 records.", durationMs: 70, timestamp: "12:00:05" },
  { id: "step-6", jobId: "job-101", stepNumber: 6, stageName: "6. Deterministic Rule Engine (Arithmetic & Limits)", status: "WARNING", details: "Evaluated exact arithmetic (Qty * Rate), totals, and tariff ceilings. 3 variances flagged.", durationMs: 85, timestamp: "12:00:06" },
  { id: "step-7", jobId: "job-101", stepNumber: 7, stageName: "7. AI Reviewer 1 (Contract & Tariff Baseline)", status: "SUCCESS", details: "Independent Reviewer 1 evaluated suspicious cases against contract agreements.", durationMs: 160, timestamp: "12:00:07" },
  { id: "step-8", jobId: "job-101", stepNumber: 8, stageName: "8. AI Reviewer 2 (Operational & Charge Structure)", status: "SUCCESS", details: "Independent Reviewer 2 evaluated operational per diem & surcharge structures (blind to Reviewer 1).", durationMs: 155, timestamp: "12:00:08" },
  { id: "step-9", jobId: "job-101", stepNumber: 9, stageName: "9. Consensus Engine (Cases 1-4 Multi-Layer Review)", status: "WARNING", details: "Evaluated consensus logic. Case 1 (Confirmed Mismatch) x2, Case 3 (AI Conflict) x1, Case 4 (AI Over-flag) x1.", durationMs: 40, timestamp: "12:00:09" },
  { id: "step-10", jobId: "job-101", stepNumber: 10, stageName: "10. Human Review Routing (When Required)", status: "WARNING", details: "Routed 2 consensus disagreement cases to Human SOA Checker review queue.", durationMs: 20, timestamp: "12:00:10" },
  { id: "step-11", jobId: "job-101", stepNumber: 11, stageName: "11. Final Verification Result & Reconciliation", status: "SUCCESS", details: "Reconciliation finalized with complete explainable audit trace.", durationMs: 30, timestamp: "12:00:11" }
];

export async function fetchJobs(): Promise<VerificationJob[]> {
  try {
    const res = await fetch(`${BASE_URL}/jobs`);
    if (!res.ok) throw new Error("Backend unavailable");
    return await res.json();
  } catch {
    return MOCK_JOBS;
  }
}

export async function fetchJobSummary(jobId: string): Promise<VerificationSummary> {
  try {
    const res = await fetch(`${BASE_URL}/jobs/${jobId}/result`);
    if (!res.ok) throw new Error("Backend unavailable");
    return await res.json();
  } catch {
    const job = MOCK_JOBS.find(j => j.id === jobId) || MOCK_JOBS[0];
    return {
      jobId: job.id,
      jobCode: job.jobCode,
      status: job.status,
      totalRecords: job.totalRecords,
      matchedCount: job.matchedCount,
      mismatchedCount: job.mismatchedCount,
      missingCount: job.missingCount,
      extraCount: job.extraCount,
      duplicateCount: job.duplicateCount,
      humanReviewCount: job.humanReviewCount,
      totalDisputedAmount: 350.00,
      currency: "USD",
      summaryNotes: "Multi-Layer Reconciliation complete. 2 confirmed mismatches (Case 1) and 2 cases requiring human review (Cases 3 & 4)."
    };
  }
}

export async function fetchDiscrepancies(jobId: string): Promise<Discrepancy[]> {
  try {
    const res = await fetch(`${BASE_URL}/jobs/${jobId}/discrepancies`);
    if (!res.ok) throw new Error("Backend unavailable");
    return await res.json();
  } catch {
    return MOCK_DISCREPANCIES;
  }
}

export async function updateDiscrepancyReviewStatus(id: string, status: HumanReviewDecision, notes?: string): Promise<void> {
  try {
    await fetch(`${BASE_URL}/discrepancies/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, reviewer: "SOA Checker", notes })
    });
  } catch {
    const item = MOCK_DISCREPANCIES.find(d => d.id === id);
    if (item) {
      item.humanReviewStatus = status;
      if (status === "ACCEPTED") item.finalDecision = "ACCEPTED_BY_HUMAN";
      else if (status === "QUERY_RAISED") item.finalDecision = "QUERIED_BY_HUMAN";
      else if (status === "DISMISSED") item.finalDecision = "DISMISSED_BY_HUMAN";
    }
  }
}

export async function fetchVerificationTrace(jobId: string): Promise<VerificationStep[]> {
  try {
    const res = await fetch(`${BASE_URL}/jobs/${jobId}/trace`);
    if (!res.ok) throw new Error("Backend unavailable");
    return await res.json();
  } catch {
    return MOCK_STEPS;
  }
}

export async function createUploadJob(pricingFile?: File, soaFile?: File): Promise<{ jobId: string; jobCode: string }> {
  try {
    const formData = new FormData();
    if (pricingFile) formData.append("pricingFile", pricingFile);
    if (soaFile) formData.append("soaFile", soaFile);
    formData.append("pricingFileName", pricingFile ? pricingFile.name : "pricing_database_sample.csv");
    formData.append("soaFileName", soaFile ? soaFile.name : "agent_soa_sample_with_discrepancies.csv");

    const res = await fetch(`${BASE_URL}/jobs/upload`, {
      method: "POST",
      body: formData
    });
    if (!res.ok) throw new Error("Upload failed");
    return await res.json();
  } catch {
    return { jobId: "job-101", jobCode: "JOB-2026-0801" };
  }
}

export async function triggerJobVerification(jobId: string): Promise<VerificationJob> {
  try {
    const res = await fetch(`${BASE_URL}/jobs/${jobId}/start`, { method: "POST" });
    if (!res.ok) throw new Error("Start failed");
    return await res.json();
  } catch {
    return MOCK_JOBS[0];
  }
}

export async function generateQueryDraft(jobId: string, agentName: string): Promise<QueryDraft> {
  try {
    const res = await fetch(`${BASE_URL}/jobs/${jobId}/generate-query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentName, tone: "formal" })
    });
    if (!res.ok) throw new Error("Draft failed");
    return await res.json();
  } catch {
    return {
      subject: `SOA Verification Query & Billing Discrepancy Notice — ${jobId} — ${agentName}`,
      greeting: `Dear ${agentName} Billing & Finance Team,`,
      bodyText: `Thank you for submitting your Statement of Account. Upon conducting our multi-layer verification (Deterministic Rules & Consensus Review) against our agreed Master Pricing Schedule, we have identified confirmed discrepancies requiring your clarification and credit note adjustment.`,
      itemizedTableMarkdown: `| Reference | Field | Category | Agreed Rate | Invoiced (SOA) | Variance | Consensus Status |\n|---|---|---|---|---|---|---|\n| HBL-SIN-LAX-8801 | Destination THC | VALUE_MISMATCH | 350.00 USD | 420.00 USD | +70.00 USD | CONFIRMED_MISMATCH |\n| HBL-SIN-LAX-8801 | Demurrage / Detention | BUSINESS_RULE_VIOLATION | 0.00 USD | 180.00 USD | +180.00 USD | CONFIRMED_MISMATCH |\n| HBL-SHA-RTM-4412 | Basic Ocean Freight | AI_REVIEW_CONFLICT | 1850.00 USD | 1950.00 USD | +100.00 USD | HUMAN_REVIEW_REQUIRED |`,
      closingText: `Kindly review the itemized table above and provide your revised SOA or credit note for the disputed variance amount ($250.00 USD).\n\nBest regards,\nSOA Checking & Audit Team`,
      fullDraft: `Dear ${agentName} Billing & Finance Team,\n\nThank you for submitting your Statement of Account. Upon conducting our multi-layer verification (Deterministic Rules & Consensus Review) against our agreed Master Pricing Schedule, we have identified confirmed discrepancies requiring your clarification and credit note adjustment.\n\n| Reference | Field | Category | Agreed Rate | Invoiced (SOA) | Variance | Consensus Status |\n|---|---|---|---|---|---|---|\n| HBL-SIN-LAX-8801 | Destination THC | VALUE_MISMATCH | 350.00 USD | 420.00 USD | +70.00 USD | CONFIRMED_MISMATCH |\n| HBL-SIN-LAX-8801 | Demurrage / Detention | BUSINESS_RULE_VIOLATION | 0.00 USD | 180.00 USD | +180.00 USD | CONFIRMED_MISMATCH |\n| HBL-SHA-RTM-4412 | Basic Ocean Freight | AI_REVIEW_CONFLICT | 1850.00 USD | 1950.00 USD | +100.00 USD | HUMAN_REVIEW_REQUIRED |\n\nKindly review the itemized table above and provide your revised SOA or credit note for the disputed variance amount ($250.00 USD).\n\nBest regards,\nSOA Checking & Audit Team`
    };
  }
}
