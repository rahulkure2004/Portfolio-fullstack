package com.rahulkure.portfolio.repository;

import com.rahulkure.portfolio.entity.Inquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;

import java.util.List;
import java.util.Optional;

public interface InquiryRepository extends JpaRepository<Inquiry, Long> {

    @EntityGraph(attributePaths = "contactMessage")
    List<Inquiry> findAllByOrderByCreatedAtDesc();

    @EntityGraph(attributePaths = "contactMessage")
    Optional<Inquiry> findById(Long id);
}
