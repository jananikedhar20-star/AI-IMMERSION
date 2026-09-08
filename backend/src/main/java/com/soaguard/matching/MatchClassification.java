package com.soaguard.matching;

public enum MatchClassification {
    EXACT_MATCH,
    PARTIAL_MATCH,
    UNMATCHED_DATABASE_RECORD,
    UNMATCHED_SOA_RECORD,
    DUPLICATE_MATCH,
    AMBIGUOUS_MATCH
}
