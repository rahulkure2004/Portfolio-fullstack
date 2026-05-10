package com.rahulkure.portfolio.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@ConfigurationProperties(prefix = "portfolio")
public class PortfolioProperties {

    private Jwt jwt = new Jwt();
    private Admin admin = new Admin();
    private String uploadDir = "uploads";
    private String publicBaseUrl = "http://localhost:8080";
    private String corsOrigins = "http://localhost:5173";

    public Jwt getJwt() {
        return jwt;
    }

    public void setJwt(Jwt jwt) {
        this.jwt = jwt;
    }

    public Admin getAdmin() {
        return admin;
    }

    public void setAdmin(Admin admin) {
        this.admin = admin;
    }

    public String getUploadDir() {
        return uploadDir;
    }

    public void setUploadDir(String uploadDir) {
        this.uploadDir = uploadDir;
    }

    public String getPublicBaseUrl() {
        return publicBaseUrl;
    }

    public void setPublicBaseUrl(String publicBaseUrl) {
        this.publicBaseUrl = publicBaseUrl;
    }

    public String getCorsOrigins() {
        return corsOrigins;
    }

    public void setCorsOrigins(String corsOrigins) {
        this.corsOrigins = corsOrigins;
    }

    public List<String> parsedCorsOrigins() {
        if (corsOrigins == null || corsOrigins.isBlank()) {
            return List.of("http://localhost:5173");
        }
        List<String> list = new ArrayList<>();
        for (String part : corsOrigins.split(",")) {
            String t = part.trim();
            if (!t.isEmpty()) {
                list.add(t);
            }
        }
        return list.isEmpty() ? List.of("http://localhost:5173") : list;
    }

    public static class Jwt {
        private String secret = "change-this-to-a-long-random-secret-key-min-256-bits-for-production";
        private long expirationMs = 86400000L;

        public String getSecret() {
            return secret;
        }

        public void setSecret(String secret) {
            this.secret = secret;
        }

        public long getExpirationMs() {
            return expirationMs;
        }

        public void setExpirationMs(long expirationMs) {
            this.expirationMs = expirationMs;
        }
    }

    public static class Admin {
        private String username = "admin";
        private String password = "ChangeMe123!";
        private String email = "rahul@example.com";

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }
}
