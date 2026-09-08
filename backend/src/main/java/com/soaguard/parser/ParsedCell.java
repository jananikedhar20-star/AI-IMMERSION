package com.soaguard.parser;

public class ParsedCell {
    private String columnName;
    private String rawValue;
    private String cellType;
    private int rowNumber;

    public ParsedCell() {}

    public ParsedCell(String columnName, String rawValue, String cellType, int rowNumber) {
        this.columnName = columnName;
        this.rawValue = rawValue;
        this.cellType = cellType;
        this.rowNumber = rowNumber;
    }

    public String getColumnName() { return columnName; }
    public void setColumnName(String columnName) { this.columnName = columnName; }
    public String getRawValue() { return rawValue; }
    public void setRawValue(String rawValue) { this.rawValue = rawValue; }
    public String getCellType() { return cellType; }
    public void setCellType(String cellType) { this.cellType = cellType; }
    public int getRowNumber() { return rowNumber; }
    public void setRowNumber(int rowNumber) { this.rowNumber = rowNumber; }
}
