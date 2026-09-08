package com.soaguard.parser;

import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Component
public class XlsxDocumentParser {
    private final DataFormatter dataFormatter = new DataFormatter();

    public ParsedDocument parse(String fileName, InputStream inputStream) throws Exception {
        ParsedDocument document = new ParsedDocument(fileName, "XLSX");

        try (Workbook workbook = WorkbookFactory.create(inputStream)) {
            int numberOfSheets = workbook.getNumberOfSheets();

            for (int s = 0; s < numberOfSheets; s++) {
                Sheet sheet = workbook.getSheetAt(s);
                String sheetName = sheet.getSheetName();
                ParsedSheet parsedSheet = new ParsedSheet(sheetName);

                int firstRowNum = sheet.getFirstRowNum();
                int lastRowNum = sheet.getLastRowNum();

                if (lastRowNum < firstRowNum) {
                    continue; // Empty sheet
                }

                // Find header row (first non-empty row)
                Row headerRow = null;
                int headerIndex = 0;
                for (int r = firstRowNum; r <= lastRowNum; r++) {
                    Row row = sheet.getRow(r);
                    if (row != null && isNonEmptyRow(row)) {
                        headerRow = row;
                        headerIndex = r;
                        break;
                    }
                }

                if (headerRow == null) {
                    continue;
                }

                parsedSheet.setHeaderRowIndex(headerIndex + 1); // 1-indexed for human readability

                List<String> headers = new ArrayList<>();
                int firstCellNum = headerRow.getFirstCellNum();
                int lastCellNum = headerRow.getLastCellNum();

                for (int c = firstCellNum; c < lastCellNum; c++) {
                    Cell cell = headerRow.getCell(c, Row.MissingCellPolicy.RETURN_BLANK_AS_NULL);
                    String headerVal = (cell != null) ? dataFormatter.formatCellValue(cell).trim() : ("Column_" + (c + 1));
                    headers.add(headerVal);
                }
                parsedSheet.setHeaders(headers);

                // Parse Data Rows
                for (int r = headerIndex + 1; r <= lastRowNum; r++) {
                    Row row = sheet.getRow(r);
                    if (row == null || !isNonEmptyRow(row)) {
                        continue; // Skip empty rows
                    }

                    ParsedRow parsedRow = new ParsedRow(r + 1); // 1-indexed

                    for (int c = 0; c < headers.size(); c++) {
                        int actualCellIdx = firstCellNum + c;
                        Cell cell = row.getCell(actualCellIdx, Row.MissingCellPolicy.RETURN_BLANK_AS_NULL);
                        String val = (cell != null) ? dataFormatter.formatCellValue(cell).trim() : "";
                        parsedRow.addCell(headers.get(c), val);
                    }

                    parsedSheet.addRow(parsedRow);
                }

                document.addSheet(parsedSheet);
            }
        }

        return document;
    }

    private boolean isNonEmptyRow(Row row) {
        for (int c = row.getFirstCellNum(); c < row.getLastCellNum(); c++) {
            Cell cell = row.getCell(c, Row.MissingCellPolicy.RETURN_BLANK_AS_NULL);
            if (cell != null) {
                String val = dataFormatter.formatCellValue(cell).trim();
                if (!val.isEmpty()) {
                    return true;
                }
            }
        }
        return false;
    }
}
