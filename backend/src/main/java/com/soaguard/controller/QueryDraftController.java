package com.soaguard.controller;

import com.soaguard.dto.QueryDraftRequest;
import com.soaguard.dto.QueryDraftResponse;
import com.soaguard.service.VerificationJobService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/jobs")
public class QueryDraftController {
    private final VerificationJobService jobService;

    public QueryDraftController(VerificationJobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping("/{id}/generate-query")
    public ResponseEntity<QueryDraftResponse> generateQuery(
            @PathVariable String id,
            @RequestBody(required = false) QueryDraftRequest request
    ) {
        String agent = request != null ? request.getAgentName() : "Pacific Ocean Logistics Pte Ltd";
        String tone = request != null ? request.getTone() : "formal";
        return ResponseEntity.ok(jobService.generateQueryDraft(id, agent, tone));
    }
}
