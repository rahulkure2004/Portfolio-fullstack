package com.rahulkure.portfolio.repository;

import com.rahulkure.portfolio.entity.ResumeAsset;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ResumeAssetRepository extends JpaRepository<ResumeAsset, Long> {
    List<ResumeAsset> findByActiveTrueOrderByUploadedAtDesc();

    Optional<ResumeAsset> findFirstByActiveTrueOrderByUploadedAtDesc();
}
