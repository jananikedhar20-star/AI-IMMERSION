package com.soaguard.repository;

import com.soaguard.model.VerificationJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VerificationJobRepository extends JpaRepository<VerificationJob, String> {
    List<VerificationJob> findAllByOrderByCreatedAtDesc();
}
