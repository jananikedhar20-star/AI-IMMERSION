# SOA Guard AI — Logistics Statement of Account Verification

**SOA Guard AI** is an AI-assisted Statement of Account (SOA) verification web application for international logistics and freight forwarding operations. It reconciles agent-submitted SOA billing statements against Master Pricing Databases through an **11-stage Multi-Layer Verification Architecture**.

---

## Key Features

1. **Deterministic Rule Engine Authority**: Exact field equality, arithmetic calculations ($Quantity \times Rate = Total$), tax calculations, totals, duplicate detection, and missing shipment checks are executed deterministically in code.
2. **Dual Blind AI Reviewers**: Independent AI Reviewer 1 (Tariff Baseline) and AI Reviewer 2 (Operational Charges) evaluate suspicious discrepancies without sharing responses.
3. **Consensus Engine**: Multi-layer decision engine implementing 4 strict consensus cases (Confirmed Mismatch, Verified, Disagreement Escalation, and Deterministic Authority Guard).
4. **Human In The Loop**: Human SOA checkers hold final decision authority. Zero silent data modifications.
5. **Configurable Field Registry**: Dynamic schema covering `REFERENCE`, `SHIPMENT`, `CARGO`, `CHARGES`, and `COMMERCIAL` groups.
6. **7 Enterprise React Screens**: Dashboard, Upload, Progress Tracker, Results Summary, Discrepancy Matrix, Audit Trace, and AI Query Generator.
7. **100% Synthetic Test Data**: Zero company confidential data.

---

## Monorepo Structure

```
soa-guard-ai/
│
├── frontend/                     # React + TypeScript + Tailwind CSS (Vite)
├── backend/                      # Spring Boot 3.3 / Java (H2 / PostgreSQL)
├── ai-service/                   # Python FastAPI Microservice
├── test-data/                    # Synthetic Logistics Datasets (4 Consensus Cases)
├── docs/                         # Architecture, API Spec & Domain Guides
├── scripts/                      # Startup & Setup Scripts
└── README.md
```

---

## Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+
- **Java**: JDK 17+
- **Python**: 3.9+
- **Maven**: 3.8+

### 2. Running the Microservices

#### Option A: Run AI Microservice (FastAPI on port 8000)
```bash
cd ai-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app/main.py
```

#### Option B: Run Backend Service (Spring Boot on port 8080)
```bash
cd backend
mvn spring-boot:run
```

#### Option C: Run Frontend Application (React on port 3000)
```bash
cd frontend
npm install
npm run dev
```

---

## Multi-Layer Verification Cases

- **CASE 1 (CONFIRMED_MISMATCH)**: Rule Engine = Mismatch, Reviewer 1 = Mismatch, Reviewer 2 = Mismatch.
- **CASE 2 (VERIFIED)**: Rule Engine = Pass, Reviewer 1 = Pass, Reviewer 2 = Pass.
- **CASE 3 (HUMAN_REVIEW_REQUIRED)**: Any disagreement between AI reviewers or conflict between rule engine and AI.
- **CASE 4 (HUMAN_REVIEW_REQUIRED)**: AI reports a problem but deterministic verification passes.
