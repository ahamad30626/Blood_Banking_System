package com.example.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO for new user registration.
 * Field-level constraints are checked automatically when @Valid is used on the controller.
 */
@Data
public class RegisterRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 128, message = "Password must be between 6 and 128 characters")
    private String password;

    // Optional — one of the standard blood type values
    @Pattern(
        regexp = "^(A[+-]|B[+-]|AB[+-]|O[+-])?$",
        message = "Blood type must be one of: A+, A-, B+, B-, AB+, AB-, O+, O-"
    )
    private String bloodType;
}
