from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

class HeaderMappingRequest(BaseModel):
    sourceHeaders: List[str] = Field(..., description="Raw column headers from uploaded file")
    targetSchemaGroup: Optional[str] = Field(None, description="Optional filter for field group")

class FieldMatchResult(BaseModel):
    sourceHeader: str
    canonicalName: str
    fieldGroup: str
    confidence: float
    reasoning: str

class HeaderMappingResponse(BaseModel):
    mappings: List[FieldMatchResult]
    unmappedHeaders: List[str]
    status: str = "SUCCESS"

class DocumentAnalysisRequest(BaseModel):
    documentType: str
    sampleRows: List[Dict[str, Any]]

class DocumentAnalysisResponse(BaseModel):
    documentType: str
    detectedFormat: str
    estimatedRecordCount: int
    detectedCurrency: str
    identifiedKeyColumns: List[str]
    notes: str

class AIReviewerRequest(BaseModel):
    reviewerId: str = Field(..., description="reviewer_1 or reviewer_2")
    recordReference: str
    fieldName: str
    fieldGroup: str
    pricingDatabaseValue: Any
    soaValue: Any
    varianceAmount: Optional[float] = None
    currency: str = "USD"
    ruleCode: Optional[str] = None
    ruleDescription: Optional[str] = None
    deterministicResult: str = Field(..., description="MISMATCH or PASS")

class AIReviewerResponse(BaseModel):
    reviewerId: str
    reviewResult: str # PASS, MISMATCH, UNCERTAIN, CONFLICT
    confidence: float
    explanation: str
    likelyCause: str
    recommendedAction: str

class ConsensusEvaluationRequest(BaseModel):
    recordReference: str
    fieldName: str
    deterministicResult: str # PASS or MISMATCH
    reviewer1Result: str     # PASS, MISMATCH, UNCERTAIN, CONFLICT
    reviewer2Result: str     # PASS, MISMATCH, UNCERTAIN, CONFLICT
    reviewer1Explanation: Optional[str] = None
    reviewer2Explanation: Optional[str] = None

class ConsensusEvaluationResponse(BaseModel):
    consensusResult: str     # CONFIRMED_MISMATCH, VERIFIED, HUMAN_REVIEW_REQUIRED, CONFLICT
    humanReviewRequired: bool
    consensusCase: str       # CASE_1, CASE_2, CASE_3, CASE_4
    reasoning: str
    suggestedFinalDecision: str

class QueryDraftRequest(BaseModel):
    jobCode: str
    agentName: str
    discrepancies: List[Dict[str, Any]]
    contactPerson: Optional[str] = "Finance / SOA Checking Team"
    tone: Optional[str] = "formal"

class QueryDraftResponse(BaseModel):
    subject: str
    greeting: str
    bodyText: str
    itemizedTableMarkdown: str
    closingText: str
    fullDraft: str
