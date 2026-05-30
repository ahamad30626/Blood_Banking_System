package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Service for user auth operations.
 */
@Service
public class UserService {

    @Autowired private UserRepository userRepository;
    @Autowired private JwtUtil jwtUtil;

    public ApiResponse<LoginResponse> register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ApiResponse.error("Email already registered. Please login.");
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());   // Use BCrypt in production
        user.setBloodType(request.getBloodType());
        user.setRole("USER");
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getName(), user.getRole());
        LoginResponse res = new LoginResponse(token, user.getName(), user.getEmail(), user.getBloodType(), user.getRole());
        return ApiResponse.success("Registration successful! Welcome, " + user.getName(), res);
    }

    public ApiResponse<LoginResponse> login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);
        if (user == null || !user.getPassword().equals(request.getPassword())) {
            return ApiResponse.error("Invalid email or password.");
        }
        String token = jwtUtil.generateToken(user.getEmail(), user.getName(), user.getRole());
        LoginResponse res = new LoginResponse(token, user.getName(), user.getEmail(), user.getBloodType(), user.getRole());
        return ApiResponse.success("Login successful! Welcome back, " + user.getName(), res);
    }

    /** Returns user info by email — used by /me endpoint. */
    public ApiResponse<LoginResponse> getCurrentUser(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return ApiResponse.error("User not found");
        LoginResponse res = new LoginResponse(null, user.getName(), user.getEmail(), user.getBloodType(), user.getRole());
        return ApiResponse.success("Authenticated", res);
    }
}
