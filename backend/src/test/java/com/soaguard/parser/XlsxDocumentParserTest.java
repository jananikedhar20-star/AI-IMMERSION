package com.soaguard.parser;

import org.junit.jupiter.api.Test;
import java.io.File;
import java.io.FileInputStream;

import static org.junit.jupiter.api.Assertions.*;

public class XlsxDocumentParserTest {
    private final XlsxDocumentParser parser = new XlsxDocumentParser();

    @Test
    public void testParseRealXlsxFile() throws Exception {
        File file = new File("/Users/jananishreek/.gemini/antigravity/scratch/soa-guard-ai/test-data/perfect_match_pricing.xlsx");
        assertTrue(file.exists(), "Test file must exist");

        try (FileInputStream fis = new FileInputStream(file)) {
            ParsedDocument doc = parser.parse(file.getName(), fis);
            assertNotNull(doc);
            assertEquals("XLSX", doc.getFileType());
            assertEquals(1, doc.getSheets().size());

            ParsedSheet sheet = doc.getFirstSheet();
            assertEquals("Logistics_Charges", sheet.getSheetName());
            assertTrue(sheet.getHeaders().contains("Invoice_No"));
            assertTrue(sheet.getHeaders().contains("Ocean_Freight"));
            assertEquals(2, sheet.getRowCount());

            ParsedRow firstRow = sheet.getRows().get(0);
            assertEquals(2, firstRow.getRowNumber()); // Row 1 is header, data row is 2
            assertEquals("INV-2026-8001", firstRow.getValue("Invoice_No"));
        }
    }
}
