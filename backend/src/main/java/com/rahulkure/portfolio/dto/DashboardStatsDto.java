package com.rahulkure.portfolio.dto;

public record DashboardStatsDto(
        long totalVisitors,
        long totalInquiries,
        long totalProjects,
        long resumeDownloads
) {
}
