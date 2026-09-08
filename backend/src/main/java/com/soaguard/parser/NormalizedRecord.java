package com.soaguard.parser;

import java.util.LinkedHashMap;
import java.util.Map;

public class NormalizedRecord {
    private String sourceFile;
    private String sheetName;
    private int rowNumber;
    private Map<String, String> rawValues;         // Original Column -> Original String
    private Map<String, Object> normalizedValues;   // Canonical Field -> Normalized Object (BigDecimal, String, LocalDate)
    private String primaryKey;

    public NormalizedRecord() {
        this.rawValues = new LinkedHashMap<>();
        this.normalizedValues = new LinkedHashMap<>();
    }

    public NormalizedRecord(String sourceFile, String sheetName, int rowNumber) {
        this();
        this.sourceFile = sourceFile;
        this.sheetName = sheetName;
        this.rowNumber = rowNumber;
    }

    public String getSourceLocation() {
        return sourceFile + " / " + (sheetName != null ? sheetName : "Sheet1") + " / Row " + rowNumber;
    }

    public String getSourceFile() { return sourceFile; }
    public void setSourceFile(String sourceFile) { this.sourceFile = sourceFile; }
    public String getSheetName() { return sheetName; }
    public void setSheetName(String sheetName) { this.sheetName = sheetName; }
    public int getRowNumber() { return rowNumber; }
    public void setRowNumber(int rowNumber) { this.rowNumber = rowNumber; }
    public Map<String, String> getRawValues() { return rawValues; }
    public void setRawValues(Map<String, String> rawValues) { this.rawValues = rawValues; }
    public Map<String, Object> getNormalizedValues() { return normalizedValues; }
    public void setNormalizedValues(Map<String, Object> normalizedValues) { this.normalizedValues = normalizedValues; }
    public String getPrimaryKey() { return primaryKey; }
    public void setPrimaryKey(String primaryKey) { this.primaryKey = primaryKey; }

    public Object getCanonicalValue(String canonicalField) {
        return normalizedValues.get(canonicalField);
    }

    public String getRawValue(String originalCol) {
        return rawValues.get(originalCol);
    }
}
