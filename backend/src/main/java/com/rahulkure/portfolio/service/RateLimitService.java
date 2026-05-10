package com.rahulkure.portfolio.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/** Simple sliding-window rate limiter for anonymous public endpoints. */
@Service
public class RateLimitService {

    private static final int MAX = 12;
    private static final long WINDOW_MS = 60_000L;
    private final Map<String, Window> windows = new ConcurrentHashMap<>();

    public void checkContact(String clientKey) {
        long now = Instant.now().toEpochMilli();
        Window w = windows.computeIfAbsent(clientKey, k -> new Window(now, 0));
        synchronized (w) {
            if (now - w.windowStart > WINDOW_MS) {
                w.windowStart = now;
                w.count = 0;
            }
            if (w.count >= MAX) {
                throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Rate limit exceeded. Try again shortly.");
            }
            w.count++;
        }
    }

    private static class Window {
        long windowStart;
        int count;

        Window(long windowStart, int count) {
            this.windowStart = windowStart;
            this.count = count;
        }
    }
}
