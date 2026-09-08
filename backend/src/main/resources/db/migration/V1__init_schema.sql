-- SOA Guard AI - PostgreSQL Database Schema (Multi-Layer Verification)
CREATE TABLE IF NOT EXISTS verification_jobs (
    id VARCHAR(36) PRIMARY KEY,
    job_code VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL,
    progress_percent INT DEFAULT 0,
    total_records INT DEFAULT 0,
    matched_count INT DEFAULT 0,
    mismatched_count INT DEFAULT 0,
    missing_count INT DEFAULT 0,
    extra_count INT DEFAULT 0,
    duplicate_count INT DEFAULT 0,
    human_review_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS uploaded_files (
    id VARCHAR(36) PRIMARY KEY,
    job_id VARCHAR(36) REFERENCES verification_jobs(id),
    file_type VARCHAR(30) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100),
    row_count INT DEFAULT 0,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS verification_results (
    id VARCHAR(36) PRIMARY KEY,
    job_id VARCHAR(36) REFERENCES verification_jobs(id),
    total_disputed_amount DECIMAL(15,2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'USD',
    status VARCHAR(30) NOT NULL,
    summary_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS discrepancies (
    id VARCHAR(36) PRIMARY KEY,
    job_id VARCHAR(36) REFERENCES verification_jobs(id),
    record_reference VARCHAR(100) NOT NULL,
    field_name VARCHAR(100) NOT NULL,
    field_group VARCHAR(50) NOT NULL,
    discrepancy_category VARCHAR(50) NOT NULL,
    database_value VARCHAR(255),
    soa_value VARCHAR(255),
    variance_amount DECIMAL(15,2) DEFAULT 0.00,
    variance_percent DECIMAL(8,2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'USD',
    rule_code VARCHAR(50),
    rule_description TEXT,
    severity VARCHAR(20) DEFAULT 'MEDIUM',
    deterministic_result VARCHAR(30) DEFAULT 'MISMATCH',
    reviewer_1_result VARCHAR(30),
    reviewer_2_result VARCHAR(30),
    consensus_result VARCHAR(50) DEFAULT 'CONFIRMED_MISMATCH',
    human_review_required BOOLEAN DEFAULT FALSE,
    human_review_status VARCHAR(30) DEFAULT 'PENDING',
    human_reviewer VARCHAR(100),
    human_review_notes TEXT,
    final_decision VARCHAR(50) DEFAULT 'CONFIRMED_MISMATCH',
    ai_explanation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS verification_steps (
    id VARCHAR(36) PRIMARY KEY,
    job_id VARCHAR(36) REFERENCES verification_jobs(id),
    step_number INT NOT NULL,
    stage_name VARCHAR(100) NOT NULL,
    status VARCHAR(30) NOT NULL,
    details TEXT,
    duration_ms BIGINT DEFAULT 0,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS field_registry (
    id VARCHAR(36) PRIMARY KEY,
    canonical_name VARCHAR(100) UNIQUE NOT NULL,
    field_group VARCHAR(50) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    data_type VARCHAR(30) NOT NULL,
    isRequired BOOLEAN DEFAULT FALSE,
    is_charge_head BOOLEAN DEFAULT FALSE,
    aliases_json TEXT,
    validation_rules_json TEXT,
    is_custom BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
