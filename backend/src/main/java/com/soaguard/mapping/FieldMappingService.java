package com.soaguard.mapping;

import com.soaguard.model.FieldRegistry;
import com.soaguard.service.FieldRegistryService;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class FieldMappingService {
    private final FieldRegistryService registryService;

    public FieldMappingService(FieldRegistryService registryService) {
        this.registryService = registryService;
    }

    public Map<String, MappedFieldResult> mapHeaders(List<String> originalHeaders) {
        Map<String, MappedFieldResult> resultMap = new LinkedHashMap<>();
        List<FieldRegistry> canonicalFields = registryService.getAllFields();

        for (String rawHeader : originalHeaders) {
            String clean = normalizeHeader(rawHeader);
            MappedFieldResult match = null;

            // 1. Check exact canonical match
            for (FieldRegistry f : canonicalFields) {
                if (clean.equals(normalizeHeader(f.getCanonicalName())) || clean.equals(normalizeHeader(f.getDisplayName()))) {
                    match = new MappedFieldResult(rawHeader, f.getCanonicalName(), f.getFieldGroup().name(), true, "EXACT");
                    break;
                }
            }

            // 2. Check configured aliases
            if (match == null) {
                for (FieldRegistry f : canonicalFields) {
                    if (f.getAliasesJson() != null) {
                        List<String> aliases = parseAliases(f.getAliasesJson());
                        for (String alias : aliases) {
                            if (clean.equals(normalizeHeader(alias))) {
                                match = new MappedFieldResult(rawHeader, f.getCanonicalName(), f.getFieldGroup().name(), true, "ALIAS");
                                break;
                            }
                        }
                    }
                    if (match != null) break;
                }
            }

            // 3. Fallback heuristic keyword match
            if (match == null) {
                match = heuristicMatch(rawHeader, clean);
            }

            // 4. If still unmapped -> UNMAPPED_FIELD
            if (match == null) {
                match = new MappedFieldResult(rawHeader, "UNMAPPED_FIELD", "UNKNOWN", false, "UNMAPPED");
            }

            resultMap.put(rawHeader, match);
        }

        return resultMap;
    }

    private String normalizeHeader(String header) {
        if (header == null) return "";
        return header.toLowerCase().replaceAll("[^a-z0-9]", "");
    }

    private List<String> parseAliases(String aliasesJson) {
        List<String> list = new ArrayList<>();
        if (aliasesJson == null || aliasesJson.isEmpty()) return list;
        String clean = aliasesJson.replace("[", "").replace("]", "").replace("\"", "");
        for (String part : clean.split(",")) {
            if (!part.trim().isEmpty()) {
                list.add(part.trim());
            }
        }
        return list;
    }

    private MappedFieldResult heuristicMatch(String raw, String clean) {
        if (clean.contains("invoice") || clean.contains("invno") || clean.contains("invnum") || clean.contains("billno")) {
            return new MappedFieldResult(raw, "invoice_no", "REFERENCE", true, "HEURISTIC");
        }
        if (clean.contains("job") || clean.contains("fileno")) {
            return new MappedFieldResult(raw, "job_no", "REFERENCE", true, "HEURISTIC");
        }
        if (clean.contains("bl") || clean.contains("hbl") || clean.contains("mbl") || clean.contains("billoflading")) {
            return new MappedFieldResult(raw, "bl_hbl_mbl", "REFERENCE", true, "HEURISTIC");
        }
        if (clean.contains("container") || clean.contains("ctr") || clean.contains("cntr")) {
            return new MappedFieldResult(raw, "container_no", "REFERENCE", true, "HEURISTIC");
        }
        if (clean.contains("pol") || clean.contains("portofloading") || clean.contains("portloading")) {
            return new MappedFieldResult(raw, "pol", "SHIPMENT", true, "HEURISTIC");
        }
        if (clean.contains("pod") || clean.contains("portofdischarge") || clean.contains("portdischarge")) {
            return new MappedFieldResult(raw, "pod", "SHIPMENT", true, "HEURISTIC");
        }
        if (clean.contains("oceanfreight") || clean.contains("basicfreight") || clean.equals("freight") || clean.contains("seafl")) {
            return new MappedFieldResult(raw, "ocean_freight", "CHARGES", true, "HEURISTIC");
        }
        if (clean.contains("originthc") || clean.contains("othc") || clean.contains("thcorigin") || clean.contains("polthc")) {
            return new MappedFieldResult(raw, "thc_origin", "CHARGES", true, "HEURISTIC");
        }
        if (clean.contains("destthc") || clean.contains("dthc") || clean.contains("thcdest") || clean.contains("podthc")) {
            return new MappedFieldResult(raw, "thc_destination", "CHARGES", true, "HEURISTIC");
        }
        if (clean.contains("docfee") || clean.contains("documentation") || clean.contains("blfee")) {
            return new MappedFieldResult(raw, "documentation_fee", "CHARGES", true, "HEURISTIC");
        }
        if (clean.contains("handling") || clean.contains("adminfee")) {
            return new MappedFieldResult(raw, "handling_fee", "CHARGES", true, "HEURISTIC");
        }
        if (clean.contains("customs") || clean.contains("brokerage")) {
            return new MappedFieldResult(raw, "customs_clearance", "CHARGES", true, "HEURISTIC");
        }
        if (clean.contains("demurrage") || clean.contains("detention") || clean.contains("storage")) {
            return new MappedFieldResult(raw, "demurrage_detention", "CHARGES", true, "HEURISTIC");
        }
        if (clean.contains("polexpenses") || clean.contains("polexpense")) {
            return new MappedFieldResult(raw, "pol_expenses", "CHARGES", true, "HEURISTIC");
        }
        if (clean.contains("podexpenses") || clean.contains("podexpense")) {
            return new MappedFieldResult(raw, "pod_expenses", "CHARGES", true, "HEURISTIC");
        }
        if (clean.contains("slotexpenses") || clean.contains("slot")) {
            return new MappedFieldResult(raw, "slot_expenses", "CHARGES", true, "HEURISTIC");
        }
        if (clean.contains("total") || clean.contains("totalamount") || clean.contains("totalbilled") || clean.contains("grossamount")) {
            return new MappedFieldResult(raw, "total", "COMMERCIAL", true, "HEURISTIC");
        }
        if (clean.contains("unitrate") || clean.contains("rate") || clean.contains("price")) {
            return new MappedFieldResult(raw, "unit_rate", "COMMERCIAL", true, "HEURISTIC");
        }
        if (clean.contains("quantity") || clean.contains("qty") || clean.contains("count")) {
            return new MappedFieldResult(raw, "quantity", "COMMERCIAL", true, "HEURISTIC");
        }
        if (clean.contains("currency") || clean.contains("curr")) {
            return new MappedFieldResult(raw, "currency", "COMMERCIAL", true, "HEURISTIC");
        }
        if (clean.contains("customer") || clean.contains("client")) {
            return new MappedFieldResult(raw, "customer_name", "REFERENCE", true, "HEURISTIC");
        }
        if (clean.contains("agent") || clean.contains("partner")) {
            return new MappedFieldResult(raw, "agent_name", "REFERENCE", true, "HEURISTIC");
        }
        return null;
    }
}
