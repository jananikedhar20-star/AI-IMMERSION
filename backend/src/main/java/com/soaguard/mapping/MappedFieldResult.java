package com.soaguard.mapping;

public class MappedFieldResult {
    private String originalHeader;
    private String canonicalName;
    private String fieldGroup;
    private boolean isMapped;
    private String matchType; // EXACT, ALIAS, UNMAPPED

    public MappedFieldResult() {}

    public MappedFieldResult(String originalHeader, String canonicalName, String fieldGroup, boolean isMapped, String matchType) {
        this.originalHeader = originalHeader;
        this.canonicalName = canonicalName;
        this.fieldGroup = fieldGroup;
        this.isMapped = isMapped;
        this.matchType = matchType;
    }

    public String getOriginalHeader() { return originalHeader; }
    public void setOriginalHeader(String originalHeader) { this.originalHeader = originalHeader; }
    public String getCanonicalName() { return canonicalName; }
    public void setCanonicalName(String canonicalName) { this.canonicalName = canonicalName; }
    public String getFieldGroup() { return fieldGroup; }
    public void setFieldGroup(String fieldGroup) { this.fieldGroup = fieldGroup; }
    public boolean isMapped() { return isMapped; }
    public void setMapped(boolean mapped) { isMapped = mapped; }
    public String getMatchType() { return matchType; }
    public void setMatchType(String matchType) { this.matchType = matchType; }
}
