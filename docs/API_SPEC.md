# SOA Guard AI — Multi-Layer API Specification

## 1. Backend REST Endpoints (Base URL: `http://localhost:8080/api/v1`)

### Job Management
- `POST /jobs/upload`: Multipart upload of Pricing DB and Agent SOA files.
- `GET /jobs`: Lists all verification jobs with progress and status metrics.
- `GET /jobs/{id}`: Returns status and summary of a specific verification job.
- `POST /jobs/{id}/start`: Initiates the 11-stage Multi-Layer Verification Pipeline.

### Verification Results & Discrepancies
- `GET /jobs/{id}/result`: Verification scorecard (Checked, Matched, Mismatched, Disputed Amount, Consensus breakdown).
- `GET /jobs/{id}/discrepancies`: Itemized discrepancy matrix with Deterministic, Reviewer 1, Reviewer 2, Consensus, and Final Decision fields.
- `PATCH /discrepancies/{id}/status`: Updates human reviewer action (`ACCEPTED`, `QUERY_RAISED`, `DISMISSED`).
- `GET /jobs/{id}/trace`: Detailed 11-stage audit step trace with rule calculation evidence.

### Field Registry & Dispute Notice
- `GET /field-registry`: Retrieves canonical fields across REFERENCE, SHIPMENT, CARGO, CHARGES, COMMERCIAL.
- `POST /field-registry`: Adds custom logistics charge heads or aliases.
- `POST /jobs/{id}/generate-query`: Generates formal dispute query letter text with attached consensus evidence tables.

---

## 2. AI Microservice Endpoints (Base URL: `http://localhost:8000/api/v1/ai`)

- `POST /field-mapping`: Schema matching between raw file column aliases and canonical dictionary.
- `POST /document-understanding`: Layout extraction, header detection, and currency parsing.
- `POST /reviewer-1`: Independent contract & tariff baseline evaluation.
- `POST /reviewer-2`: Independent operational charge structure evaluation (blind to Reviewer 1).
- `POST /consensus`: Evaluates Cases 1 to 4 and determines consensus routing.
- `POST /query-draft`: Generates formal dispute inquiry notice with Markdown evidence tables.
