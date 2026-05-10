package com.rahulkure.portfolio.dto;

import com.rahulkure.portfolio.entity.InquiryStatus;

public record InquiryPatchRequest(
        InquiryStatus status,
        String adminNotes
) {
}
