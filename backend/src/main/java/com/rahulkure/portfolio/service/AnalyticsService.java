package com.rahulkure.portfolio.service;

import com.rahulkure.portfolio.dto.AnalyticsRequest;
import com.rahulkure.portfolio.entity.Analytics;
import com.rahulkure.portfolio.entity.AnalyticsEventType;
import com.rahulkure.portfolio.repository.AnalyticsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AnalyticsService {

    private final AnalyticsRepository analyticsRepository;

    public AnalyticsService(AnalyticsRepository analyticsRepository) {
        this.analyticsRepository = analyticsRepository;
    }

    @Transactional
    public void recordVisit(AnalyticsRequest req) {
        Analytics a = new Analytics();
        a.setEventType(AnalyticsEventType.VISIT);
        a.setMetadata(trim(req.path()) + " | ref: " + trim(req.referrer()));
        a.setSessionKey(sessionOrGenerate(req.sessionKey()));
        analyticsRepository.save(a);
    }

    @Transactional
    public void recordResumeDownload(AnalyticsRequest req) {
        Analytics a = new Analytics();
        a.setEventType(AnalyticsEventType.RESUME_DOWNLOAD);
        a.setMetadata(trim(req.path()));
        a.setSessionKey(sessionOrGenerate(req.sessionKey()));
        analyticsRepository.save(a);
    }

    public long countVisits() {
        return analyticsRepository.countByEventType(AnalyticsEventType.VISIT);
    }

    public long countResumeDownloads() {
        return analyticsRepository.countByEventType(AnalyticsEventType.RESUME_DOWNLOAD);
    }

    private String trim(String s) {
        if (s == null) {
            return "";
        }
        return s.length() > 480 ? s.substring(0, 480) : s;
    }

    private String sessionOrGenerate(String key) {
        if (key == null || key.isBlank()) {
            return UUID.randomUUID().toString();
        }
        return key.length() > 64 ? key.substring(0, 64) : key;
    }
}
