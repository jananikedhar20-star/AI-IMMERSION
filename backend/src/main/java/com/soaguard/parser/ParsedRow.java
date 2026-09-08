package com.soaguard.parser;

import java.util.LinkedHashMap;
import java.util.Map;

public class ParsedRow {
    private int rowNumber;
    private Map<String, String> cellValues; // ColName -> RawStringValue

    public ParsedRow() {
        this.cellValues = new LinkedHashMap<>();
    }

    public ParsedRow(int rowNumber) {
        this();
        this.rowNumber = rowNumber;
    }

    public int getRowNumber() { return rowNumber; }
    public void setRowNumber(int rowNumber) { this.rowNumber = rowNumber; }
    public Map<String, String> getCellValues() { return cellValues; }
    public void setCellValues(Map<String, String> cellValues) { this.cellValues = cellValues; }
    public void addCell(String colName, String value) { this.cellValues.put(colName, value); }
    public String getValue(String colName) { return this.cellValues.get(colName); }
}
