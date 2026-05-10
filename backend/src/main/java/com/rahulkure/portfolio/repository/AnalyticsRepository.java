package com.rahulkure.portfolio.repository;

import com.rahulkure.portfolio.entity.Analytics;
import com.rahulkure.portfolio.entity.AnalyticsEventType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnalyticsRepository extends JpaRepository<Analytics, Long> {
    long countByEventType(AnalyticsEventType eventType);
}
