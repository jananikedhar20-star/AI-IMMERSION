package com.soaguard.controller;

import com.soaguard.model.VerificationJob;
import com.soaguard.service.FileUploadService;
import com.soaguard.service.VerificationJobService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/jobs")
public class VerificationJobController {
    private final VerificationJobService jobService;
    private final FileUploadService uploadService;

    public VerificationJobController(VerificationJobService jobService, FileUploadService uploadService) {
        this.jobService = jobService;
        this.uploadService = uploadService;
    }

    @GetMapping
    public ResponseEntity<List<VerificationJob>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VerificationJob> getJobById(@PathVariable String id) {
        return jobService.getJobById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadAndCreateJob(
            @RequestParam(value = "pricingFile", required = false) MultipartFile pricingFile,
            @RequestParam(value = "soaFile", required = false) MultipartFile soaFile,
            @RequestParam(value = "presetName", defaultValue = "multi_charge_mismatch") String presetName
    ) {
        try {
            File pFile;
            File sFile;

            if (pricingFile != null && !pricingFile.isEmpty()) {
                pFile = uploadService.storeFile(pricingFile, "pricing");
            } else {
                pFile = uploadService.getSyntheticPresetFile(presetName, "PRICING_DB");
            }

            if (soaFile != null && !soaFile.isEmpty()) {
                sFile = uploadService.storeFile(soaFile, "soa");
            } else {
                sFile = uploadService.getSyntheticPresetFile(presetName, "AGENT_SOA");
            }

            VerificationJob job = jobService.createJob(presetName, pFile, sFile);

            Map<String, Object> resp = new HashMap<>();
            resp.put("jobId", job.getId());
            resp.put("jobCode", job.getJobCode());
            resp.put("status", job.getStatus());
            resp.put("pricingFileName", pFile.getName());
            resp.put("soaFileName", sFile.getName());
            resp.put("message", "Files uploaded and verification job initialized successfully");
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            Map<String, Object> err = new HashMap<>();
            err.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }

    @PostMapping("/{id}/start")
    public ResponseEntity<VerificationJob> startJob(@PathVariable String id) {
        try {
            VerificationJob job = jobService.runVerificationForJob(id);
            return ResponseEntity.ok(job);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
