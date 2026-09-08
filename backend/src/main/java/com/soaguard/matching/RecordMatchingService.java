package com.soaguard.matching;

import com.soaguard.parser.NormalizedRecord;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RecordMatchingService {

    public List<MatchedRecordPair> matchRecords(List<NormalizedRecord> dbRecords, List<NormalizedRecord> soaRecords) {
        List<MatchedRecordPair> matchedPairs = new ArrayList<>();
        Set<NormalizedRecord> matchedDbRecords = new HashSet<>();
        Set<NormalizedRecord> matchedSoaRecords = new HashSet<>();
        Map<String, Integer> soaKeyCounts = new HashMap<>();

        // Priority Keys to match sequentially
        String[] priorityKeys = {"invoice_no", "job_no", "bl_hbl_mbl", "container_no"};

        // 1. Detect Duplicate SOA records first
        for (NormalizedRecord soa : soaRecords) {
            String key = getFirstNonNullKey(soa, priorityKeys);
            if (key != null) {
                soaKeyCounts.put(key, soaKeyCounts.getOrDefault(key, 0) + 1);
            }
        }

        // 2. Multi-priority key matching loop
        for (String keyField : priorityKeys) {
            Map<String, NormalizedRecord> availableDbMap = new HashMap<>();
            for (NormalizedRecord db : dbRecords) {
                if (!matchedDbRecords.contains(db)) {
                    Object val = db.getCanonicalValue(keyField);
                    if (val != null && !val.toString().isEmpty()) {
                        availableDbMap.put(val.toString().toUpperCase(), db);
                    }
                }
            }

            for (NormalizedRecord soa : soaRecords) {
                if (!matchedSoaRecords.contains(soa)) {
                    Object val = soa.getCanonicalValue(keyField);
                    if (val != null && !val.toString().isEmpty()) {
                        String strVal = val.toString().toUpperCase();
                        NormalizedRecord matchedDb = availableDbMap.get(strVal);

                        if (matchedDb != null) {
                            boolean isDuplicate = soaKeyCounts.getOrDefault(strVal, 0) > 1;
                            MatchClassification classification = isDuplicate ? MatchClassification.DUPLICATE_MATCH : MatchClassification.EXACT_MATCH;

                            matchedPairs.add(new MatchedRecordPair(matchedDb, soa, classification, keyField, strVal));
                            matchedDbRecords.add(matchedDb);
                            matchedSoaRecords.add(soa);
                            availableDbMap.remove(strVal);
                        }
                    }
                }
            }
        }

        // 3. Fallback Compound Match (Customer + POL + POD)
        for (NormalizedRecord soa : soaRecords) {
            if (!matchedSoaRecords.contains(soa)) {
                String compoundKeySoa = buildCompoundKey(soa);
                if (compoundKeySoa != null) {
                    for (NormalizedRecord db : dbRecords) {
                        if (!matchedDbRecords.contains(db)) {
                            String compoundKeyDb = buildCompoundKey(db);
                            if (compoundKeySoa.equals(compoundKeyDb)) {
                                matchedPairs.add(new MatchedRecordPair(db, soa, MatchClassification.PARTIAL_MATCH, "compound_route", compoundKeySoa));
                                matchedDbRecords.add(db);
                                matchedSoaRecords.add(soa);
                                break;
                            }
                        }
                    }
                }
            }
        }

        // 4. Record Unmatched Database Records (Missing in SOA)
        for (NormalizedRecord db : dbRecords) {
            if (!matchedDbRecords.contains(db)) {
                String ref = getFirstNonNullKey(db, priorityKeys);
                matchedPairs.add(new MatchedRecordPair(db, null, MatchClassification.UNMATCHED_DATABASE_RECORD, "reference", ref != null ? ref : "DB_ROW_" + db.getRowNumber()));
            }
        }

        // 5. Record Unmatched SOA Records (Extra in SOA)
        for (NormalizedRecord soa : soaRecords) {
            if (!matchedSoaRecords.contains(soa)) {
                String ref = getFirstNonNullKey(soa, priorityKeys);
                matchedPairs.add(new MatchedRecordPair(null, soa, MatchClassification.UNMATCHED_SOA_RECORD, "reference", ref != null ? ref : "SOA_ROW_" + soa.getRowNumber()));
            }
        }

        return matchedPairs;
    }

    private String getFirstNonNullKey(NormalizedRecord record, String[] keys) {
        for (String k : keys) {
            Object v = record.getCanonicalValue(k);
            if (v != null && !v.toString().trim().isEmpty()) {
                return v.toString().trim().toUpperCase();
            }
        }
        return null;
    }

    private String buildCompoundKey(NormalizedRecord r) {
        Object pol = r.getCanonicalValue("pol");
        Object pod = r.getCanonicalValue("pod");
        Object cust = r.getCanonicalValue("customer_name");
        if (pol != null && pod != null) {
            return (cust != null ? cust.toString().toUpperCase() : "") + "_" + pol.toString().toUpperCase() + "_" + pod.toString().toUpperCase();
        }
        return null;
    }
}
