package com.soaguard.repository;

import com.soaguard.model.VerificationResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VerificationResultRepository extends JpaRepository<VerificationResult, String> {
    Optional<VerificationResult> findByJobId(String jobId);
}
