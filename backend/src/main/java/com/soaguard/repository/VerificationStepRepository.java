package com.soaguard.repository;

import com.soaguard.model.VerificationStep;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VerificationStepRepository extends JpaRepository<VerificationStep, String> {
    List<VerificationStep> findByJobIdOrderByStepNumberAsc(String jobId);
}
