package com.example.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a blood donor registered in the system.
 * Has separate username/password for donor-specific login.
 */
@Entity
@Table(name = "donors")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Donor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Blood group is required")
    private String bloodGroup;

    private String phone;
    private String email;
    private String location;

    @Column(unique = true)
    private String username;

    private String password;

    // Whether the donor is currently available for donation
    private boolean available = true;
}
