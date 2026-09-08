from fastapi import APIRouter
from app.schemas.models import (
    HeaderMappingRequest, HeaderMappingResponse,
    DocumentAnalysisRequest, DocumentAnalysisResponse,
    AIReviewerRequest, AIReviewerResponse,
    ConsensusEvaluationRequest, ConsensusEvaluationResponse,
    QueryDraftRequest, QueryDraftResponse
)
from app.core.mock_engine import (
    map_headers, run_ai_reviewer_1, run_ai_reviewer_2,
    evaluate_consensus, generate_query_letter
)

router = APIRouter(prefix="/api/v1/ai", tags=["Multi-Layer AI Verification Layer"])

@router.post("/field-mapping", response_model=HeaderMappingResponse)
async def map_field_headers(req: HeaderMappingRequest):
    return map_headers(req.sourceHeaders)

@router.post("/document-understanding", response_model=DocumentAnalysisResponse)
async def analyze_document(req: DocumentAnalysisRequest):
    return DocumentAnalysisResponse(
        documentType=req.documentType,
        detectedFormat="CSV/Tabular",
        estimatedRecordCount=len(req.sampleRows),
        detectedCurrency="USD",
        identifiedKeyColumns=list(req.sampleRows[0].keys()) if req.sampleRows else [],
        notes="Document schema recognized with standard logistics freight table format."
    )

@router.post("/reviewer-1", response_model=AIReviewerResponse)
async def reviewer_1_endpoint(req: AIReviewerRequest):
    req.reviewerId = "AI_REVIEWER_1"
    return run_ai_reviewer_1(req)

@router.post("/reviewer-2", response_model=AIReviewerResponse)
async def reviewer_2_endpoint(req: AIReviewerRequest):
    req.reviewerId = "AI_REVIEWER_2"
    return run_ai_reviewer_2(req)

@router.post("/consensus", response_model=ConsensusEvaluationResponse)
async def consensus_endpoint(req: ConsensusEvaluationRequest):
    return evaluate_consensus(req)

@router.post("/query-draft", response_model=QueryDraftResponse)
async def generate_query_draft(req: QueryDraftRequest):
    return generate_query_letter(req.jobCode, req.agentName, req.discrepancies)
