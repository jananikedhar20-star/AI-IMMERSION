# SOA Guard AI — Multi-Layer Verification Architecture

## 1. System Overview
SOA Guard AI is an AI-assisted Statement of Account (SOA) verification web application engineered for logistics and freight forwarding operations. It automates cross-file reconciliation between Master Pricing Databases and Agent-submitted SOAs through an **11-stage Multi-Layer Verification Architecture**.

---

## 2. Multi-Layer Verification Pipeline

The verification pipeline executes in 11 sequential stages:

```
1. File Ingestion & Format Validation
   ↓
2. Data Extraction & Tabular Layout Parsing
   ↓
3. Field Mapping (AI Semantic Association to 5 Canonical Groups)
   ↓
4. Data Normalization (ISO 8601 Dates, Currency Codes, String Trimming)
   ↓
5. Record Matching (Exact Deterministic Keys: BL / Job / Container)
   ↓
6. Deterministic Rule Engine (AUTHORITY: Exact math, Qty * Rate, Totals, Duplicate & Missing checks)
   ↓
7. AI Reviewer 1 (Independent Contract & Tariff Baseline Analysis)
   ↓
8. AI Reviewer 2 (Independent Operational & Charge-Structure Analysis - Blind to Reviewer 1)
   ↓
9. Consensus Engine (Evaluates Cases 1 to 4 across Rule Engine, Reviewer 1, and Reviewer 2)
   ↓
10. Human Review Routing (Enforces Human Authority on Disagreements / Conflicts)
   ↓
11. Final Verification Result & Explainable Audit Trace
   ↓
12. (Actionable) Formal Query Generator
```

---

## 3. Core Design Principles

### A. Deterministic Rule Engine Authority
The deterministic rule engine is the **sole authority** for:
- Exact field equality
- Numerical comparison
- Arithmetic calculations (e.g. $\text{Quantity} \times \text{Unit Rate} = \text{Amount}$)
- Subtotal, Tax, Discount, and Total calculations
- Currency normalization
- Duplicate record detection
- Missing record detection (in Pricing DB or SOA)
- Extra / unquoted record detection
- Configurable business rules and tariff ceilings

> **CRITICAL RULE**: LLMs must **NOT** independently decide basic arithmetic or silently override deterministic results. The AI must never silently modify source data or invent missing values.

### B. Dual Blind AI Reviewers
- **AI Reviewer 1 (Tariff & Contract Baseline)**: Evaluates contractual clauses, negotiated tariff baselines, and commercial rate terms.
- **AI Reviewer 2 (Operational & Surcharge Structure)**: Evaluates operational charge validity, detention per diem rules, and low-sulphur/terminal surcharges.
- **Blind Guarantee**: AI Reviewer 2 does **NOT** receive AI Reviewer 1's answer, guaranteeing unbiased independent review.

### C. Consensus Engine Logic & Cases

| Case | Deterministic Result | AI Reviewer 1 | AI Reviewer 2 | Final Consensus Outcome | Action |
|---|---|---|---|---|---|
| **CASE 1** | `MISMATCH` | `MISMATCH` | `MISMATCH` | `CONFIRMED_MISMATCH` | Flagged as confirmed variance with evidence table attached |
| **CASE 2** | `PASS` | `PASS` | `PASS` | `VERIFIED` | Cleared for immediate settlement |
| **CASE 3** | Any disagreement between AI reviewers or conflict between rule engine and AI interpretation | `HUMAN_REVIEW_REQUIRED` | Escalated to Human SOA Checker queue |
| **CASE 4** | `PASS` (Deterministic) | `MISMATCH` (AI Reviewer) | `PASS` / `MISMATCH` | `HUMAN_REVIEW_REQUIRED` | Deterministic engine cannot be silently overridden; escalated to human checker |

---

## 4. Architectural Concepts & Discrepancy Categories

### Key Concepts
- `VerificationDecision`: `VERIFIED`, `CONFIRMED_MISMATCH`, `HUMAN_REVIEW_REQUIRED`, `ACCEPTED_BY_HUMAN`, `QUERIED_BY_HUMAN`, `DISMISSED_BY_HUMAN`
- `AIReviewResult`: `PASS`, `MISMATCH`, `UNCERTAIN`, `CONFLICT`
- `ConsensusResult`: `CONFIRMED_MISMATCH`, `VERIFIED`, `HUMAN_REVIEW_REQUIRED`, `CONFLICT`
- `HumanReviewDecision`: `PENDING`, `ACCEPTED`, `QUERY_RAISED`, `DISMISSED`

### Standard Discrepancy Categories
1. `VALUE_MISMATCH`: Rate or tariff variance on standard line items.
2. `MISSING_RECORD`: Shipment present in Pricing DB but absent in SOA.
3. `EXTRA_RECORD`: Invoiced shipment not found in agreed master pricing.
4. `DUPLICATE_RECORD`: Multiple billings for the same container / BL.
5. `CALCULATION_ERROR`: Arithmetic mismatch ($Qty \times Rate \neq Total$).
6. `CURRENCY_MISMATCH`: Conflicting billing currency codes without exchange parity.
7. `FIELD_MAPPING_UNCERTAIN`: Column header ambiguity requiring confirmation.
8. `BUSINESS_RULE_VIOLATION`: Unauthorized demurrage, storage, or unagreed fee.
9. `AI_REVIEW_CONFLICT`: Divergence between Reviewer 1 and Reviewer 2.

---

## 5. Technology Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS v4, Lucide Icons, Vite
- **Backend**: Spring Boot 3.3.x, Java 17+, Spring Data JPA, PostgreSQL / H2 In-Memory
- **AI Microservice**: Python 3.10+, FastAPI, Pydantic v2, Uvicorn
- **Monorepo**: Single repository architecture with isolated tier modules
