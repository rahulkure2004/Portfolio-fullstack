package com.rahulkure.portfolio.dto;

import com.rahulkure.portfolio.entity.InquiryStatus;

import java.time.Instant;

public record InquiryAdminDto(
        Long id,
        String fullName,
        String email,
        String phone,
        String subject,
        String budget,
        String serviceType,
        String message,
        InquiryStatus status,
        String adminNotes,
        Instant createdAt,
        Instant updatedAt
) {
}
