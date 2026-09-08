import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as ai_router

app = FastAPI(
    title="SOA Guard AI — Multi-Layer AI Microservice",
    description="Multi-layer document understanding, field mapping, independent dual AI reviews, and consensus evaluation.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai_router)

@app.get("/health")
async def health_check():
    return {
        "status": "UP",
        "service": "SOA Guard AI Microservice",
        "version": "1.0.0",
        "layers": ["AI_REVIEWER_1", "AI_REVIEWER_2", "CONSENSUS_ENGINE"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=False)
