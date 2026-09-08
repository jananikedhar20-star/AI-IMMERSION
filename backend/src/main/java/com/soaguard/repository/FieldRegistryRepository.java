package com.soaguard.repository;

import com.soaguard.model.FieldRegistry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FieldRegistryRepository extends JpaRepository<FieldRegistry, String> {
    Optional<FieldRegistry> findByCanonicalName(String canonicalName);
}
