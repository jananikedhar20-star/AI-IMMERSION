package com.soaguard.verification;

import com.soaguard.parser.NormalizedRecord;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

public class CalculationVerificationServiceTest {
    private final CalculationVerificationService service = new CalculationVerificationService();

    @Test
    public void testQuantityTimesRatePassAndFail() {
        NormalizedRecord rPass = new NormalizedRecord("soa.xlsx", "Sheet1", 2);
        rPass.getNormalizedValues().put("quantity", new BigDecimal("2"));
        rPass.getNormalizedValues().put("unit_rate", new BigDecimal("1850.00"));
        rPass.getNormalizedValues().put("ocean_freight", new BigDecimal("3700.00"));

        CalculationVerificationService.CalcCheckResult resPass = service.checkQuantityTimesRate(rPass);
        assertTrue(resPass.passed);
        assertTrue(resPass.verifiable);

        NormalizedRecord rFail = new NormalizedRecord("soa.xlsx", "Sheet1", 3);
        rFail.getNormalizedValues().put("quantity", new BigDecimal("2"));
        rFail.getNormalizedValues().put("unit_rate", new BigDecimal("1850.00"));
        rFail.getNormalizedValues().put("ocean_freight", new BigDecimal("3900.00")); // Mismatch

        CalculationVerificationService.CalcCheckResult resFail = service.checkQuantityTimesRate(rFail);
        assertFalse(resFail.passed);
        assertTrue(resFail.verifiable);
    }
}
