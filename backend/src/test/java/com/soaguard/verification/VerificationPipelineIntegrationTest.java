package com.soaguard.verification;

import com.soaguard.mapping.FieldMappingService;
import com.soaguard.matching.RecordMatchingService;
import com.soaguard.model.*;
import com.soaguard.normalizer.DataNormalizationService;
import com.soaguard.parser.CsvDocumentParser;
import com.soaguard.parser.DocumentParserService;
import com.soaguard.parser.XlsxDocumentParser;
import com.soaguard.repository.*;
import com.soaguard.service.FieldRegistryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.lang.reflect.Proxy;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

public class VerificationPipelineIntegrationTest {

    private VerificationPipelineService pipelineService;
    private final Map<String, VerificationJob> jobStore = new HashMap<>();
    private final Map<String, List<Discrepancy>> discrepancyStore = new HashMap<>();
    private final Map<String, List<VerificationStep>> stepStore = new HashMap<>();
    private final List<FieldRegistry> fieldList = new ArrayList<>();

    @SuppressWarnings("unchecked")
    private <T> T createProxy(Class<T> repoInterface, java.lang.reflect.InvocationHandler handler) {
        return (T) Proxy.newProxyInstance(repoInterface.getClassLoader(), new Class<?>[]{repoInterface}, handler);
    }

    @BeforeEach
    public void setup() {
        XlsxDocumentParser xlsxParser = new XlsxDocumentParser();
        CsvDocumentParser csvParser = new CsvDocumentParser();
        DocumentParserService parserService = new DocumentParserService(xlsxParser, csvParser);

        FieldRegistryRepository fakeRegistryRepo = createProxy(FieldRegistryRepository.class, (proxy, method, args) -> {
            String name = method.getName();
            if (name.equals("findAll") || name.equals("findAllByOrderByCreatedAtAsc")) return fieldList;
            if (name.equals("save")) {
                FieldRegistry f = (FieldRegistry) args[0];
                fieldList.add(f);
                return f;
            }
            if (name.equals("count")) return (long) fieldList.size();
            return null;
        });

        FieldRegistryService fieldRegistryService = new FieldRegistryService(fakeRegistryRepo);
        fieldRegistryService.initDefaults();

        FieldMappingService mappingService = new FieldMappingService(fieldRegistryService);
        DataNormalizationService normService = new DataNormalizationService();
        RecordMatchingService matchingService = new RecordMatchingService();
        CalculationVerificationService calcService = new CalculationVerificationService();
        DeterministicComparisonService compService = new DeterministicComparisonService(fieldRegistryService, calcService);

        VerificationJobRepository fakeJobRepo = createProxy(VerificationJobRepository.class, (proxy, method, args) -> {
            String name = method.getName();
            if (name.equals("findById")) return Optional.ofNullable(jobStore.get((String) args[0]));
            if (name.equals("save")) {
                VerificationJob j = (VerificationJob) args[0];
                jobStore.put(j.getId(), j);
                return j;
            }
            if (name.equals("findAllByOrderByCreatedAtDesc") || name.equals("findAll")) return new ArrayList<>(jobStore.values());
            if (name.equals("count")) return (long) jobStore.size();
            return null;
        });

        DiscrepancyRepository fakeDiscrepancyRepo = createProxy(DiscrepancyRepository.class, (proxy, method, args) -> {
            String name = method.getName();
            if (name.equals("findByJobIdOrderByCreatedAtAsc") || name.equals("findByJobId")) {
                return discrepancyStore.getOrDefault((String) args[0], new ArrayList<>());
            }
            if (name.equals("save")) {
                Discrepancy d = (Discrepancy) args[0];
                discrepancyStore.computeIfAbsent(d.getJobId(), k -> new ArrayList<>()).add(d);
                return d;
            }
            return null;
        });

        VerificationResultRepository fakeResultRepo = createProxy(VerificationResultRepository.class, (proxy, method, args) -> {
            if (method.getName().equals("save")) return args[0];
            return Optional.empty();
        });

        VerificationStepRepository fakeStepRepo = createProxy(VerificationStepRepository.class, (proxy, method, args) -> {
            String name = method.getName();
            if (name.equals("findByJobIdOrderByStepNumberAsc") || name.equals("findByJobId")) {
                return stepStore.getOrDefault((String) args[0], new ArrayList<>());
            }
            if (name.equals("save")) {
                VerificationStep s = (VerificationStep) args[0];
                stepStore.computeIfAbsent(s.getJobId(), k -> new ArrayList<>()).add(s);
                return s;
            }
            return null;
        });

        pipelineService = new VerificationPipelineService(
                parserService, mappingService, normService, matchingService, compService,
                fakeJobRepo, fakeResultRepo, fakeDiscrepancyRepo, fakeStepRepo
        );
    }

    @Test
    public void testPerfectMatchDataset() throws Exception {
        String jobId = "JOB-TEST-PERFECT";
        VerificationJob job = new VerificationJob(jobId, jobId);
        jobStore.put(jobId, job);

        File pFile = new File("/Users/jananishreek/.gemini/antigravity/scratch/soa-guard-ai/test-data/perfect_match_pricing.xlsx");
        File sFile = new File("/Users/jananishreek/.gemini/antigravity/scratch/soa-guard-ai/test-data/perfect_match_soa.xlsx");

        VerificationJob executedJob = pipelineService.executeVerificationPipeline(jobId, pFile, sFile);
        assertNotNull(executedJob);
        assertEquals(JobStatus.COMPLETED, executedJob.getStatus());
        assertEquals(2, executedJob.getMatchedCount());
        assertEquals(0, executedJob.getMismatchedCount());

        List<Discrepancy> discrepancies = discrepancyStore.getOrDefault(jobId, new ArrayList<>());
        assertEquals(0, discrepancies.size(), "Perfect match dataset must have 0 discrepancies");
    }

    @Test
    public void testMultipleLogisticsChargeMismatchDataset() throws Exception {
        String jobId = "JOB-TEST-MULTI";
        VerificationJob job = new VerificationJob(jobId, jobId);
        jobStore.put(jobId, job);

        File pFile = new File("/Users/jananishreek/.gemini/antigravity/scratch/soa-guard-ai/test-data/multi_charge_mismatch_pricing.xlsx");
        File sFile = new File("/Users/jananishreek/.gemini/antigravity/scratch/soa-guard-ai/test-data/multi_charge_mismatch_soa.xlsx");

        VerificationJob executedJob = pipelineService.executeVerificationPipeline(jobId, pFile, sFile);
        assertNotNull(executedJob);
        assertEquals(JobStatus.REQUIRES_REVIEW, executedJob.getStatus());

        List<Discrepancy> discrepancies = discrepancyStore.getOrDefault(jobId, new ArrayList<>());
        assertTrue(discrepancies.size() > 0, "Multi-charge dataset must detect discrepancies");

        // Verify source location is preserved in rule description
        Discrepancy d1 = discrepancies.get(0);
        assertTrue(d1.getRuleDescription().contains("Row"), "Source location row number must be present");
    }
}
