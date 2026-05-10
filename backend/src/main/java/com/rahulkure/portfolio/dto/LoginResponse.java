package com.rahulkure.portfolio.dto;

public record LoginResponse(String token, String type) {
    public LoginResponse(String token) {
        this(token, "Bearer");
    }
}
