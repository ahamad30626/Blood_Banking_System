package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.service.RateLimiterService;
import com.example.demo.service.UserService;
import com.example.demo.util.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

/**
 * Auth controller — register, login, logout, /me.
 *
 * Security design:
 *  - JWT is sent as an httpOnly cookie (prevents XSS token theft).
 *  - Response body only contains user info, never the raw token.
 *  - /me validates the cookie and returns current user info on page refresh.
 *  - Rate limiting protects login and register from brute-force.
 */
@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired private UserService userService;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private RateLimiterService rateLimiter;

    @Value("${app.jwt.expiration}") private long jwtExpiration;
    @Value("${app.cookie.secure:false}") private boolean cookieSecure;
    @Value("${app.cookie.same-site:Lax}") private String cookieSameSite;

    // ── Register ──────────────────────────────────────────────────────────────

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<LoginResponse>> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletRequest httpReq,
            HttpServletResponse httpRes) {

        // Rate-limit by client IP
        String ip = getClientIp(httpReq);
        if (!rateLimiter.isAllowed(ip)) {
            long retry = rateLimiter.getRetryAfterSeconds(ip);
            httpRes.setHeader("Retry-After", String.valueOf(retry));
            return ResponseEntity.status(429).body(
                ApiResponse.error("Too many requests. Please wait " + retry + " seconds.")
            );
        }

        ApiResponse<LoginResponse> result = userService.register(request);
        if (!result.isSuccess()) return ResponseEntity.badRequest().body(result);

        setJwtCookie(httpRes, result.getData().getToken());
        result.getData().setToken(null); // never expose token in response body
        return ResponseEntity.ok(result);
    }

    // ── Login ─────────────────────────────────────────────────────────────────

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpReq,
            HttpServletResponse httpRes) {

        String ip = getClientIp(httpReq);
        if (!rateLimiter.isAllowed(ip)) {
            long retry = rateLimiter.getRetryAfterSeconds(ip);
            httpRes.setHeader("Retry-After", String.valueOf(retry));
            return ResponseEntity.status(429).body(
                ApiResponse.error("Too many login attempts. Try again in " + retry + " seconds.")
            );
        }

        ApiResponse<LoginResponse> result = userService.login(request);
        if (!result.isSuccess()) return ResponseEntity.status(401).body(result);

        setJwtCookie(httpRes, result.getData().getToken());
        result.getData().setToken(null);
        return ResponseEntity.ok(result);
    }

    // ── Logout ────────────────────────────────────────────────────────────────

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletResponse response) {
        // Overwrite the cookie with an empty value and maxAge=0 to delete it
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/")
                .maxAge(0)
                .sameSite(cookieSameSite)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully", null));
    }

    // ── Current User (/me) ───────────────────────────────────────────────────

    /**
     * Called on page load to restore session from httpOnly cookie.
     * Returns user info if the cookie is valid, 401 otherwise.
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<LoginResponse>> me(HttpServletRequest request) {
        String token = extractTokenFromCookies(request);
        if (token == null || !jwtUtil.validateToken(token)) {
            return ResponseEntity.status(401).body(ApiResponse.error("Not authenticated"));
        }
        String email = jwtUtil.getEmailFromToken(token);
        return ResponseEntity.ok(userService.getCurrentUser(email));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private void setJwtCookie(HttpServletResponse response, String token) {
        ResponseCookie cookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)               // JS cannot read this cookie → XSS safe
                .secure(cookieSecure)         // true in prod (HTTPS)
                .path("/")
                .maxAge(Duration.ofMillis(jwtExpiration))
                .sameSite(cookieSameSite)     // Lax in dev, Strict in prod
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private String extractTokenFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return null;
        for (Cookie c : cookies) {
            if ("jwt".equals(c.getName())) return c.getValue();
        }
        return null;
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
