package com.soaguard.mapping;

import com.soaguard.model.FieldGroup;
import com.soaguard.model.FieldRegistry;
import com.soaguard.service.FieldRegistryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

public class FieldMappingServiceTest {
    private FieldMappingService mappingService;

    @BeforeEach
    public void setup() {
        FieldRegistry f1 = new FieldRegistry();
        f1.setId("1");
        f1.setCanonicalName("invoice_no");
        f1.setDisplayName("Invoice Number");
        f1.setFieldGroup(FieldGroup.REFERENCE);
        f1.setAliasesJson("[\"INV_NO\", \"Bill_No\"]");

        FieldRegistry f2 = new FieldRegistry();
        f2.setId("2");
        f2.setCanonicalName("ocean_freight");
        f2.setDisplayName("Ocean Freight");
        f2.setFieldGroup(FieldGroup.CHARGES);
        f2.setAliasesJson("[\"Basic_Freight\", \"Sea_Freight\"]");

        FieldRegistry f3 = new FieldRegistry();
        f3.setId("3");
        f3.setCanonicalName("thc_destination");
        f3.setDisplayName("Destination THC");
        f3.setFieldGroup(FieldGroup.CHARGES);
        f3.setAliasesJson("[\"Dest_THC\", \"DTHC\"]");

        List<FieldRegistry> list = Arrays.asList(f1, f2, f3);

        FieldRegistryService stubService = new FieldRegistryService(null) {
            @Override
            public List<FieldRegistry> getAllFields() {
                return list;
            }
        };

        mappingService = new FieldMappingService(stubService);
    }

    @Test
    public void testExactAndAliasMapping() {
        List<String> headers = Arrays.asList("Invoice_No", "Basic_Freight", "Dest_THC", "Random_Unmapped_Header");
        Map<String, MappedFieldResult> result = mappingService.mapHeaders(headers);

        assertEquals("invoice_no", result.get("Invoice_No").getCanonicalName());
        assertTrue(result.get("Invoice_No").isMapped());

        assertEquals("ocean_freight", result.get("Basic_Freight").getCanonicalName());
        assertTrue(result.get("Basic_Freight").isMapped());

        assertEquals("thc_destination", result.get("Dest_THC").getCanonicalName());
        assertTrue(result.get("Dest_THC").isMapped());

        assertEquals("UNMAPPED_FIELD", result.get("Random_Unmapped_Header").getCanonicalName());
        assertFalse(result.get("Random_Unmapped_Header").isMapped());
    }
}
