package com.soaguard.normalizer;

import org.junit.jupiter.api.Test;
import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

public class DataNormalizationServiceTest {
    private final DataNormalizationService service = new DataNormalizationService();

    @Test
    public void testNumberNormalization() {
        assertEquals(new BigDecimal("4500.00"), service.normalizeNumber("₹ 4,500.00"));
        assertEquals(new BigDecimal("3200.50"), service.normalizeNumber("$ 3,200.50 USD"));
        assertEquals(new BigDecimal("120.00"), service.normalizeNumber("120"));
        assertEquals(BigDecimal.ZERO.setScale(2), service.normalizeNumber(""));
    }

    @Test
    public void testCurrencyNormalization() {
        assertEquals("USD", service.normalizeCurrency("$"));
        assertEquals("INR", service.normalizeCurrency("₹"));
        assertEquals("INR", service.normalizeCurrency("INR"));
        assertEquals("EUR", service.normalizeCurrency("€"));
    }

    @Test
    public void testDateNormalization() {
        assertEquals("2026-08-20", service.normalizeDate("20/08/2026"));
        assertEquals("2026-08-20", service.normalizeDate("2026-08-20"));
    }
}
