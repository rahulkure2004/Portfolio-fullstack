package com.rahulkure.portfolio.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactRequest(
        @NotBlank @Size(max = 120) String fullName,
        @NotBlank @Email String email,
        @Size(max = 40) String phone,
        @NotBlank @Size(max = 200) String subject,
        @Size(max = 500) String budget,
        @NotBlank @Size(max = 80) String serviceType,
        @NotBlank @Size(max = 4000) String message,
        @NotBlank String captchaToken,
        @NotBlank String captchaAnswer,
        String website
) {
}
