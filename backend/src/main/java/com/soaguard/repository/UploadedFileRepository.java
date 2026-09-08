package com.soaguard.repository;

import com.soaguard.model.UploadedFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UploadedFileRepository extends JpaRepository<UploadedFile, String> {
    List<UploadedFile> findByJobId(String jobId);
}
