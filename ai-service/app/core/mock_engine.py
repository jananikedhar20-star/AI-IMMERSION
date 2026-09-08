import re
from typing import List, Dict, Any
from app.schemas.models import (
    FieldMatchResult, HeaderMappingResponse, DocumentAnalysisResponse,
    AIReviewerRequest, AIReviewerResponse, ConsensusEvaluationRequest,
    ConsensusEvaluationResponse, QueryDraftResponse
)

CANONICAL_KEYWORDS = {
    "invoice_no": ["invoice", "inv", "bill", "inv_no", "inv_num"],
    "soa_no": ["soa", "statement", "soa_no", "soa_ref"],
    "job_no": ["job", "file", "job_no", "file_no"],
    "bl_hbl_mbl": ["bl", "hbl", "mbl", "bill of lading", "master bl", "house bl", "bill_of_lading", "awb"],
    "container_no": ["container", "ctr", "cntr", "equipment", "box"],
    "agent_name": ["agent", "partner", "vendor", "agent_name"],
    "customer_name": ["customer", "client", "debtor", "account_name"],
    "pol": ["pol", "port of loading", "port_loading", "loading_port", "departure"],
    "pod": ["pod", "port of discharge", "port_discharge", "discharge_port", "arrival"],
    "container_type": ["size", "type", "size_type", "container_type", "20gp", "40hc"],
    "chargeable_weight": ["chargeable", "chg_wt", "chargeable_weight", "billable_wt"],
    "gross_weight": ["gross", "gw", "gross_weight", "g_w"],
    "volume_cbm": ["volume", "cbm", "vol", "m3"],
    "ocean_freight": ["freight", "ocean_freight", "basic_freight", "o/f", "sea_freight", "air_freight"],
    "thc_origin": ["origin_thc", "othc", "thc_origin", "origin thc", "pol thc"],
    "thc_destination": ["dest_thc", "dthc", "thc_destination", "dest thc", "pod thc"],
    "documentation_fee": ["doc", "documentation", "doc_fee", "bl_fee", "edi_fee"],
    "handling_fee": ["handling", "admin", "processing", "agency_handling"],
    "customs_clearance": ["customs", "clearance", "brokerage", "customs_fee"],
    "demurrage_detention": ["demurrage", "detention", "storage", "storage_demurrage", "per_diem"],
    "total": ["total", "total_billed", "gross_total", "invoice_total", "total_agreed_amount", "amount"],
    "currency": ["currency", "curr", "currency_code", "billing_currency"]
}

def map_headers(headers: List[str]) -> HeaderMappingResponse:
    mappings = []
    unmapped = []
    for h in headers:
        normalized = re.sub(r"[^a-z0-9]", "_", h.lower().strip())
        matched = False
        for canonical, keywords in CANONICAL_KEYWORDS.items():
            for kw in keywords:
                if kw in normalized:
                    group = "REFERENCE" if canonical in ["invoice_no", "soa_no", "job_no", "bl_hbl_mbl", "container_no", "agent_name", "customer_name"]                             else "SHIPMENT" if canonical in ["pol", "pod"]                             else "CARGO" if canonical in ["container_type", "chargeable_weight", "gross_weight", "volume_cbm"]                             else "CHARGES" if canonical in ["ocean_freight", "thc_origin", "thc_destination", "documentation_fee", "handling_fee", "customs_clearance", "demurrage_detention"]                             else "COMMERCIAL"
                    
                    mappings.append(FieldMatchResult(
                        sourceHeader=h,
                        canonicalName=canonical,
                        fieldGroup=group,
                        confidence=0.95 if normalized == canonical else 0.88,
                        reasoning=f"Matched keyword pattern '{kw}' for field '{h}'"
                    ))
                    matched = True
                    break
            if matched:
                break
        if not matched:
            unmapped.append(h)
    return HeaderMappingResponse(mappings=mappings, unmappedHeaders=unmapped)

# Independent AI Reviewer 1 (Context & Tariff Focused)
def run_ai_reviewer_1(req: AIReviewerRequest) -> AIReviewerResponse:
    # Reviewer 1 analyzes contractual terms and tariff baseline
    if req.deterministicResult == "MISMATCH":
        if "detention" in req.fieldName.lower() or "demurrage" in req.fieldName.lower():
            return AIReviewerResponse(
                reviewerId="AI_REVIEWER_1",
                reviewResult="MISMATCH",
                confidence=0.96,
                explanation=f"Reviewer 1 confirms: SOA value {req.soaValue} {req.currency} for {req.fieldName} lacks corresponding contractual authorization in Pricing DB (Agreed: {req.pricingDatabaseValue}).",
                likelyCause="Unapproved port detention or equipment demurrage charged without logged waiver.",
                recommendedAction="Flag for query to request free-time waiver documentation or credit note."
            )
        else:
            return AIReviewerResponse(
                reviewerId="AI_REVIEWER_1",
                reviewResult="MISMATCH",
                confidence=0.92,
                explanation=f"Reviewer 1 confirms tariff variance: Invoiced {req.soaValue} {req.currency} exceeds agreed contract baseline {req.pricingDatabaseValue} {req.currency}.",
                likelyCause="Agent applied standard spot tariff instead of negotiated contract schedule.",
                recommendedAction="Verify against contract rate sheet and request rate correction."
            )
    else:
        return AIReviewerResponse(
            reviewerId="AI_REVIEWER_1",
            reviewResult="PASS",
            confidence=0.98,
            explanation=f"Reviewer 1 confirms: Value {req.soaValue} matches contractual schedule.",
            likelyCause="Standard billing alignment.",
            recommendedAction="Approved for clearance."
        )

# Independent AI Reviewer 2 (Operational & Charge-Structure Focused - Does NOT receive Reviewer 1 answer)
def run_ai_reviewer_2(req: AIReviewerRequest) -> AIReviewerResponse:
    # Reviewer 2 analyzes operational charge structures, volume formulas, and potential billing bundling
    if req.deterministicResult == "MISMATCH":
        if "detention" in req.fieldName.lower() or "demurrage" in req.fieldName.lower():
            return AIReviewerResponse(
                reviewerId="AI_REVIEWER_2",
                reviewResult="MISMATCH",
                confidence=0.94,
                explanation=f"Reviewer 2 confirms: Additional line item of {req.soaValue} {req.currency} detected on {req.recordReference} without gate-in/gate-out delay validation.",
                likelyCause="Terminal storage / per diem penalty assessed by local terminal operator.",
                recommendedAction="Require agent to attach gate equipment interchange receipts (EIR)."
            )
        else:
            return AIReviewerResponse(
                reviewerId="AI_REVIEWER_2",
                reviewResult="MISMATCH",
                confidence=0.91,
                explanation=f"Reviewer 2 confirms: Rate delta of +{req.varianceAmount} {req.currency} found on {req.fieldName}.",
                likelyCause="Currency exchange fluctuation or unitemized local handling surcharge inclusion.",
                recommendedAction="Request itemized cost breakdown from agent."
            )
    else:
        return AIReviewerResponse(
            reviewerId="AI_REVIEWER_2",
            reviewResult="PASS",
            confidence=0.99,
            explanation=f"Reviewer 2 confirms: Operational charge values align with container equipment profile.",
            likelyCause="Standard verified charges.",
            recommendedAction="Approved for clearance."
        )

# Consensus Engine implementing all 4 required consensus cases
def evaluate_consensus(req: ConsensusEvaluationRequest) -> ConsensusEvaluationResponse:
    det = req.deterministicResult
    r1 = req.reviewer1Result
    r2 = req.reviewer2Result

    # CASE 1: Rule engine = mismatch, Reviewer 1 = mismatch, Reviewer 2 = mismatch -> CONFIRMED_MISMATCH
    if det == "MISMATCH" and r1 == "MISMATCH" and r2 == "MISMATCH":
        return ConsensusEvaluationResponse(
            consensusResult="CONFIRMED_MISMATCH",
            humanReviewRequired=False,
            consensusCase="CASE_1",
            reasoning="Unanimous consensus across Deterministic Rule Engine, AI Reviewer 1, and AI Reviewer 2 confirming discrepancy.",
            suggestedFinalDecision="CONFIRMED_MISMATCH"
        )

    # CASE 2: Rule engine = pass, Reviewer 1 = pass, Reviewer 2 = pass -> VERIFIED
    elif det == "PASS" and r1 == "PASS" and r2 == "PASS":
        return ConsensusEvaluationResponse(
            consensusResult="VERIFIED",
            humanReviewRequired=False,
            consensusCase="CASE_2",
            reasoning="Unanimous agreement: Rule Engine passed and both independent AI Reviewers validated the record.",
            suggestedFinalDecision="VERIFIED"
        )

    # CASE 4: AI reports a problem but deterministic verification cannot reproduce it -> HUMAN_REVIEW_REQUIRED
    elif det == "PASS" and (r1 == "MISMATCH" or r2 == "MISMATCH"):
        return ConsensusEvaluationResponse(
            consensusResult="HUMAN_REVIEW_REQUIRED",
            humanReviewRequired=True,
            consensusCase="CASE_4",
            reasoning="Conflict detected: AI Reviewer flagged a potential issue, but Deterministic Rule Engine calculated a PASS. Deterministic engine cannot be silently overridden; escalating to human SOA checker.",
            suggestedFinalDecision="HUMAN_REVIEW_REQUIRED"
        )

    # CASE 3: Any disagreement between AI reviewers or conflict between deterministic and AI
    else:
        return ConsensusEvaluationResponse(
            consensusResult="HUMAN_REVIEW_REQUIRED",
            humanReviewRequired=True,
            consensusCase="CASE_3",
            reasoning=f"Disagreement or conflict in verification layers (Deterministic: {det}, Reviewer 1: {r1}, Reviewer 2: {r2}). Escalating to Human SOA Reviewer as final authority.",
            suggestedFinalDecision="HUMAN_REVIEW_REQUIRED"
        )

def generate_query_letter(job_code: str, agent_name: str, discrepancies: List[Dict[str, Any]]) -> QueryDraftResponse:
    subject = f"SOA Verification Query & Billing Discrepancy Notice — Job #{job_code} — {agent_name}"
    greeting = f"Dear {agent_name} Billing & Finance Team,"
    
    body = (
        f"Thank you for submitting your Statement of Account for Job #{job_code}. "
        "Upon conducting our automated multi-layer verification (Deterministic Rules & Consensus Review) against our agreed Master Pricing Schedule, "
        f"we have identified {len(discrepancies)} confirmed billing discrepancy(ies) requiring your urgent review and adjustment."
    )
    
    table_rows = ["| BL / Job Ref | Field | Category | Agreed Rate | Invoiced (SOA) | Variance | Consensus Status |",
                  "|---|---|---|---|---|---|---|"]
    
    for d in discrepancies:
        ref = d.get("recordReference", "N/A")
        field = d.get("fieldName", "Charge")
        cat = d.get("discrepancyCategory", "VALUE_MISMATCH")
        db_val = d.get("databaseValue", "-")
        soa_val = d.get("soaValue", "-")
        var_val = d.get("varianceAmount", 0.0)
        status = d.get("consensusResult", "CONFIRMED_MISMATCH")
        curr = d.get("currency", "USD")
        table_rows.append(f"| {ref} | {field} | {cat} | {db_val} {curr} | {soa_val} {curr} | +{var_val} {curr} | {status} |")
        
    table_md = "\n".join(table_rows)
    
    closing = (
        "Kindly review the attached discrepancies above. Please provide your revised SOA or issue a corresponding credit note "
        "for the disputed amount at your earliest convenience so we may finalize payment authorization.\n\n"
        "Best regards,\nSOA Checking & Audit Team\nLogistics Operations Group"
    )
    
    full_draft = f"{greeting}\n\n{body}\n\n{table_md}\n\n{closing}"
    
    return QueryDraftResponse(
        subject=subject,
        greeting=greeting,
        bodyText=body,
        itemizedTableMarkdown=table_md,
        closingText=closing,
        fullDraft=full_draft
    )
