package com.soaguard.controller;

import com.soaguard.dto.StatusUpdateRequest;
import com.soaguard.model.Discrepancy;
import com.soaguard.service.VerificationJobService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class DiscrepancyController {
    private final VerificationJobService jobService;

    public DiscrepancyController(VerificationJobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping("/jobs/{id}/discrepancies")
    public ResponseEntity<List<Discrepancy>> getJobDiscrepancies(@PathVariable String id) {
        return ResponseEntity.ok(jobService.getJobDiscrepancies(id));
    }

    @PatchMapping("/discrepancies/{id}/status")
    public ResponseEntity<Discrepancy> updateDiscrepancyStatus(
            @PathVariable String id,
            @RequestBody StatusUpdateRequest request
    ) {
        return ResponseEntity.ok(jobService.updateDiscrepancyStatus(id, request));
    }
}
