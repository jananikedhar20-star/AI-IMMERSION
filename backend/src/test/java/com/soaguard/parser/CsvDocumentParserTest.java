package com.soaguard.parser;

import org.junit.jupiter.api.Test;
import java.io.File;
import java.io.FileInputStream;

import static org.junit.jupiter.api.Assertions.*;

public class CsvDocumentParserTest {
    private final CsvDocumentParser parser = new CsvDocumentParser();

    @Test
    public void testParseRealCsvFile() throws Exception {
        File file = new File("/Users/jananishreek/.gemini/antigravity/scratch/soa-guard-ai/test-data/perfect_match_pricing.csv");
        assertTrue(file.exists(), "Test file must exist");

        try (FileInputStream fis = new FileInputStream(file)) {
            ParsedDocument doc = parser.parse(file.getName(), fis);
            assertNotNull(doc);
            assertEquals("CSV", doc.getFileType());

            ParsedSheet sheet = doc.getFirstSheet();
            assertTrue(sheet.getHeaders().contains("Invoice_No"));
            assertEquals(2, sheet.getRowCount());
        }
    }
}
