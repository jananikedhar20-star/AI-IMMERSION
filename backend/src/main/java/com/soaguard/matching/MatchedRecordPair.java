package com.soaguard.matching;

import com.soaguard.parser.NormalizedRecord;

public class MatchedRecordPair {
    private NormalizedRecord databaseRecord;
    private NormalizedRecord soaRecord;
    private MatchClassification classification;
    private String matchedKey;
    private String matchedValue;

    public MatchedRecordPair() {}

    public MatchedRecordPair(NormalizedRecord databaseRecord, NormalizedRecord soaRecord, MatchClassification classification, String matchedKey, String matchedValue) {
        this.databaseRecord = databaseRecord;
        this.soaRecord = soaRecord;
        this.classification = classification;
        this.matchedKey = matchedKey;
        this.matchedValue = matchedValue;
    }

    public NormalizedRecord getDatabaseRecord() { return databaseRecord; }
    public void setDatabaseRecord(NormalizedRecord databaseRecord) { this.databaseRecord = databaseRecord; }
    public NormalizedRecord getSoaRecord() { return soaRecord; }
    public void setSoaRecord(NormalizedRecord soaRecord) { this.soaRecord = soaRecord; }
    public MatchClassification getClassification() { return classification; }
    public void setClassification(MatchClassification classification) { this.classification = classification; }
    public String getMatchedKey() { return matchedKey; }
    public void setMatchedKey(String matchedKey) { this.matchedKey = matchedKey; }
    public String getMatchedValue() { return matchedValue; }
    public void setMatchedValue(String matchedValue) { this.matchedValue = matchedValue; }
}
