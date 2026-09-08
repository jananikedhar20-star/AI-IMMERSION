package com.soaguard.parser;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Component
public class CsvDocumentParser {

    public ParsedDocument parse(String fileName, InputStream inputStream) throws Exception {
        ParsedDocument document = new ParsedDocument(fileName, "CSV");
        ParsedSheet sheet = new ParsedSheet("Default");
        sheet.setHeaderRowIndex(1);

        // Read stream into buffer with UTF-8 support
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8));

        // Auto-detect delimiter from first few lines if needed (default to comma)
        CSVFormat format = CSVFormat.DEFAULT.builder()
                .setHeader()
                .setSkipHeaderRecord(true)
                .setIgnoreHeaderCase(false)
                .setTrim(true)
                .setIgnoreEmptyLines(true)
                .setAllowMissingColumnNames(true)
                .build();

        try (CSVParser parser = new CSVParser(reader, format)) {
            List<String> headers = new ArrayList<>(parser.getHeaderNames());
            sheet.setHeaders(headers);

            int rowNumber = 2; // Row 1 is header, data starts at row 2
            for (CSVRecord record : parser) {
                boolean allEmpty = true;
                ParsedRow parsedRow = new ParsedRow(rowNumber);

                for (String header : headers) {
                    String val = record.isSet(header) ? record.get(header).trim() : "";
                    if (!val.isEmpty()) {
                        allEmpty = false;
                    }
                    parsedRow.addCell(header, val);
                }

                if (!allEmpty) {
                    sheet.addRow(parsedRow);
                }
                rowNumber++;
            }
        }

        document.addSheet(sheet);
        return document;
    }
}
