package com.soaguard.matching;

import com.soaguard.parser.NormalizedRecord;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class RecordMatchingServiceTest {
    private final RecordMatchingService matchingService = new RecordMatchingService();

    @Test
    public void testExactMatchingAndMissingExtraDetection() {
        NormalizedRecord db1 = new NormalizedRecord("pricing.xlsx", "Sheet1", 2);
        db1.getNormalizedValues().put("invoice_no", "INV-1001");
        db1.getNormalizedValues().put("bl_hbl_mbl", "BL-1001");

        NormalizedRecord db2 = new NormalizedRecord("pricing.xlsx", "Sheet1", 3);
        db2.getNormalizedValues().put("invoice_no", "INV-1002");

        NormalizedRecord soa1 = new NormalizedRecord("soa.xlsx", "Sheet1", 2);
        soa1.getNormalizedValues().put("invoice_no", "INV-1001");

        NormalizedRecord soaExtra = new NormalizedRecord("soa.xlsx", "Sheet1", 3);
        soaExtra.getNormalizedValues().put("invoice_no", "INV-9999");

        List<MatchedRecordPair> pairs = matchingService.matchRecords(Arrays.asList(db1, db2), Arrays.asList(soa1, soaExtra));

        assertEquals(3, pairs.size());

        // 1 Exact Match
        assertTrue(pairs.stream().anyMatch(p -> p.getClassification() == MatchClassification.EXACT_MATCH && p.getMatchedValue().equals("INV-1001")));
        // 1 Missing in SOA (db2)
        assertTrue(pairs.stream().anyMatch(p -> p.getClassification() == MatchClassification.UNMATCHED_DATABASE_RECORD));
        // 1 Extra in SOA (soaExtra)
        assertTrue(pairs.stream().anyMatch(p -> p.getClassification() == MatchClassification.UNMATCHED_SOA_RECORD));
    }
}
