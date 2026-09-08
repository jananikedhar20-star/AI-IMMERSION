package com.soaguard.controller;

import com.soaguard.dto.VerificationSummaryDTO;
import com.soaguard.service.VerificationJobService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/jobs")
public class VerificationResultController {
    private final VerificationJobService jobService;

    public VerificationResultController(VerificationJobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping("/{id}/result")
    public ResponseEntity<VerificationSummaryDTO> getJobResult(@PathVariable String id) {
        return ResponseEntity.ok(jobService.getJobSummary(id));
    }
}
