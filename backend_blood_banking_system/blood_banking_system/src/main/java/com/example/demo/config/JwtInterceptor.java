package com.example.demo.config;

import com.example.demo.util.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * JWT interceptor — validates the JWT on every non-auth API request.
 *
 * Token lookup order:
 *  1. httpOnly cookie named "jwt"   ← primary (secure)
 *  2. Authorization: Bearer header  ← fallback (dev tools / Postman testing)
 *
 * After validation, the user's email and role are stored as request
 * attributes so controllers can do role-based checks without a DB call:
 *   String role  = (String) request.getAttribute("userRole");
 *   String email = (String) request.getAttribute("userEmail");
 */
@Component
public class JwtInterceptor implements HandlerInterceptor {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) throws Exception {

        // Always allow preflight (CORS) and auth endpoints
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) return true;
        if (request.getRequestURI().startsWith("/api/auth"))  return true;

        // GET requests are publicly readable
        if ("GET".equalsIgnoreCase(request.getMethod())) return true;

        // Resolve token (cookie first, then header)
        String token = extractToken(request);
        if (token == null) {
            sendError(response, 401, "Authentication required. Please login.");
            return false;
        }
        if (!jwtUtil.validateToken(token)) {
            sendError(response, 401, "Session expired. Please login again.");
            return false;
        }

        // Store claims as request attributes — controllers read these for RBAC
        request.setAttribute("userEmail", jwtUtil.getEmailFromToken(token));
        request.setAttribute("userRole",  jwtUtil.getRoleFromToken(token));
        return true;
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private String extractToken(HttpServletRequest request) {
        // 1. httpOnly cookie
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie c : cookies) {
                if ("jwt".equals(c.getName())) return c.getValue();
            }
        }
        // 2. Authorization header fallback
        String auth = request.getHeader("Authorization");
        if (auth != null && auth.startsWith("Bearer ")) {
            return auth.substring(7);
        }
        return null;
    }

    private void sendError(HttpServletResponse response, int status, String message) throws Exception {
        response.setStatus(status);
        response.setContentType("application/json");
        response.getWriter().write(
            "{\"success\":false,\"message\":\"" + message + "\",\"data\":null}"
        );
    }
}
