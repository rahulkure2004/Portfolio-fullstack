package com.rahulkure.portfolio.service;

import com.rahulkure.portfolio.dto.CaptchaResponse;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CaptchaService {

    private static final long TTL_MS = 15 * 60_000L;
    private final SecureRandom random = new SecureRandom();
    private final Map<String, CaptchaEntry> store = new ConcurrentHashMap<>();

    public CaptchaResponse generate() {
        purge();
        int a = 1 + random.nextInt(12);
        int b = 1 + random.nextInt(12);
        String token = UUID.randomUUID().toString();
        store.put(token, new CaptchaEntry(a + b, System.currentTimeMillis()));
        String question = "What is " + a + " + " + b + "?";
        return new CaptchaResponse(token, question);
    }

    public boolean validate(String token, String answer) {
        if (token == null || answer == null) {
            return false;
        }
        purge();
        CaptchaEntry entry = store.remove(token);
        if (entry == null) {
            return false;
        }
        try {
            int v = Integer.parseInt(answer.trim());
            return v == entry.expected;
        } catch (NumberFormatException ex) {
            return false;
        }
    }

    private void purge() {
        long now = System.currentTimeMillis();
        store.entrySet().removeIf(e -> now - e.getValue().createdAt > TTL_MS);
    }

    private record CaptchaEntry(int expected, long createdAt) {
    }
}
