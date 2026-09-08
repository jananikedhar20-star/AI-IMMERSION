package com.soaguard.repository;

import com.soaguard.model.Discrepancy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiscrepancyRepository extends JpaRepository<Discrepancy, String> {
    List<Discrepancy> findByJobIdOrderByCreatedAtAsc(String jobId);
}
