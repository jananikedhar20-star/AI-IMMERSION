package com.soaguard.parser;

import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;

@Service
public class DocumentParserService {
    private final XlsxDocumentParser xlsxParser;
    private final CsvDocumentParser csvParser;

    public DocumentParserService(XlsxDocumentParser xlsxParser, CsvDocumentParser csvParser) {
        this.xlsxParser = xlsxParser;
        this.csvParser = csvParser;
    }

    public ParsedDocument parseFile(File file) throws Exception {
        try (InputStream is = new FileInputStream(file)) {
            return parseStream(file.getName(), is);
        }
    }

    public ParsedDocument parseStream(String fileName, InputStream inputStream) throws Exception {
        String lower = fileName.toLowerCase();
        if (lower.endsWith(".xlsx") || lower.endsWith(".xls")) {
            return xlsxParser.parse(fileName, inputStream);
        } else if (lower.endsWith(".csv") || lower.endsWith(".txt")) {
            return csvParser.parse(fileName, inputStream);
        } else {
            // Default to CSV parser fallback
            return csvParser.parse(fileName, inputStream);
        }
    }
}
