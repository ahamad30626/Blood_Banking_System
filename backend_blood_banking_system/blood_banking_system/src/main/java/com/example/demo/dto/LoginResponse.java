package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Returned on successful login/register.
 * 'token' is set to null before sending to the client —
 * the actual JWT is sent as an httpOnly cookie instead.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String token;     // cleared before JSON response — used internally only
    private String name;
    private String email;
    private String bloodType;
    private String role;      // USER or ADMIN — used by the frontend for conditional UI
}
