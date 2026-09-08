package com.soaguard.parser;

import java.util.ArrayList;
import java.util.List;

public class ParsedDocument {
    private String fileName;
    private String fileType; // XLSX or CSV
    private List<ParsedSheet> sheets;

    public ParsedDocument() {
        this.sheets = new ArrayList<>();
    }

    public ParsedDocument(String fileName, String fileType) {
        this();
        this.fileName = fileName;
        this.fileType = fileType;
    }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    public List<ParsedSheet> getSheets() { return sheets; }
    public void setSheets(List<ParsedSheet> sheets) { this.sheets = sheets; }
    public void addSheet(ParsedSheet sheet) { this.sheets.add(sheet); }

    public int getTotalRowCount() {
        return sheets.stream().mapToInt(ParsedSheet::getRowCount).sum();
    }

    public ParsedSheet getFirstSheet() {
        return sheets.isEmpty() ? null : sheets.get(0);
    }
}
