package com.soaguard.controller;

import com.soaguard.model.FieldRegistry;
import com.soaguard.service.FieldRegistryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/field-registry")
public class FieldRegistryController {
    private final FieldRegistryService registryService;

    public FieldRegistryController(FieldRegistryService registryService) {
        this.registryService = registryService;
    }

    @GetMapping
    public ResponseEntity<List<FieldRegistry>> getAllFields() {
        return ResponseEntity.ok(registryService.getAllFields());
    }

    @PostMapping
    public ResponseEntity<FieldRegistry> createField(@RequestBody FieldRegistry field) {
        return ResponseEntity.ok(registryService.saveField(field));
    }
}
