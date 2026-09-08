package com.soaguard.parser;

import java.util.ArrayList;
import java.util.List;

public class ParsedSheet {
    private String sheetName;
    private int headerRowIndex;
    private List<String> headers;
    private List<ParsedRow> rows;

    public ParsedSheet() {
        this.headers = new ArrayList<>();
        this.rows = new ArrayList<>();
    }

    public ParsedSheet(String sheetName) {
        this();
        this.sheetName = sheetName;
    }

    public String getSheetName() { return sheetName; }
    public void setSheetName(String sheetName) { this.sheetName = sheetName; }
    public int getHeaderRowIndex() { return headerRowIndex; }
    public void setHeaderRowIndex(int headerRowIndex) { this.headerRowIndex = headerRowIndex; }
    public List<String> getHeaders() { return headers; }
    public void setHeaders(List<String> headers) { this.headers = headers; }
    public List<ParsedRow> getRows() { return rows; }
    public void setRows(List<ParsedRow> rows) { this.rows = rows; }
    public void addRow(ParsedRow row) { this.rows.add(row); }
    public int getRowCount() { return rows.size(); }
}
