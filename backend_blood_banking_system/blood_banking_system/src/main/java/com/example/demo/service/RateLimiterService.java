package com.example.demo.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Simple in-memory rate limiter.
 * Tracks request timestamps per key (e.g. client IP).
 * Allows at most MAX_ATTEMPTS within WINDOW_MS milliseconds.
 *
 * Why: Without rate limiting, bots can brute-force the login endpoint
 * indefinitely. This adds a basic defence layer that's easy to extend.
 */
@Service
public class RateLimiterService {

    private static final int MAX_ATTEMPTS = 5;       // max requests per window
    private static final long WINDOW_MS   = 60_000L; // 1-minute sliding window

    private final ConcurrentHashMap<String, List<Long>> log = new ConcurrentHashMap<>();

    /**
     * Returns true if the caller is within the allowed rate.
     * Returns false if the limit has been exceeded.
     */
    public boolean isAllowed(String key) {
        long now = System.currentTimeMillis();

        log.compute(key, (k, timestamps) -> {
            if (timestamps == null) timestamps = new ArrayList<>();
            // Remove entries outside the sliding window
            timestamps.removeIf(t -> now - t > WINDOW_MS);
            timestamps.add(now);
            return timestamps;
        });

        return log.get(key).size() <= MAX_ATTEMPTS;
    }

    /**
     * Returns remaining seconds until the window resets for the given key.
     */
    public long getRetryAfterSeconds(String key) {
        List<Long> timestamps = log.get(key);
        if (timestamps == null || timestamps.isEmpty()) return 0;
        long oldest = timestamps.get(0);
        long resetAt = oldest + WINDOW_MS;
        return Math.max(0, (resetAt - System.currentTimeMillis()) / 1000);
    }
}
