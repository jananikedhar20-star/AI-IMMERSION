package com.soaguard.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
public class HealthController {
    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> resp = new HashMap<>();
        resp.put("status", "UP");
        resp.put("service", "SOA Guard AI - Core Backend");
        resp.put("timestamp", LocalDateTime.now().toString());
        resp.put("database", "H2 (in-memory) / PostgreSQL Ready");
        return ResponseEntity.ok(resp);
    }
}
