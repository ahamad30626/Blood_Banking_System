package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.model.Donor;
import com.example.demo.service.DonorService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Donor REST controller.
 *
 * Pagination: GET /api/donors?page=0&size=10&sortBy=name
 * All mutating endpoints require a valid JWT (enforced by JwtInterceptor).
 */
@RestController
@RequestMapping("/api/donors")
public class DonorController {

    @Autowired
    private DonorService donorService;

    /**
     * Register a new donor.
     * @Valid validates the Donor object — returns 400 with field errors if invalid.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Donor>> registerDonor(
            @Valid @RequestBody Donor donor) {
        return ResponseEntity.ok(donorService.registerDonor(donor));
    }

    /**
     * Get all donors with pagination.
     * Example: GET /api/donors?page=0&size=10&sortBy=name
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<Donor>>> getAllDonors(
            @RequestParam(defaultValue = "0")    int page,
            @RequestParam(defaultValue = "10")   int size,
            @RequestParam(defaultValue = "id")   String sortBy,
            @RequestParam(defaultValue = "asc")  String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        return ResponseEntity.ok(donorService.getAllDonors(pageable));
    }

    /**
     * Get donor by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Donor>> getDonorById(@PathVariable Long id) {
        return ResponseEntity.ok(donorService.getDonorById(id));
    }

    /**
     * Donor-specific login (separate from user auth).
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Donor>> donorLogin(
            @RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        ApiResponse<Donor> response = donorService.donorLogin(username, password);
        if (response.isSuccess()) return ResponseEntity.ok(response);
        return ResponseEntity.status(401).body(response);
    }

    /**
     * Toggle donor availability — ADMIN only.
     */
    @PutMapping("/{id}/availability")
    public ResponseEntity<ApiResponse<Donor>> updateAvailability(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body,
            HttpServletRequest request) {

        if (!isAdmin(request)) {
            return ResponseEntity.status(403)
                    .body(ApiResponse.error("Admin access required to update donor availability."));
        }
        return ResponseEntity.ok(donorService.updateAvailability(id, body.get("available")));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private boolean isAdmin(HttpServletRequest request) {
        String role = (String) request.getAttribute("userRole");
        return "ADMIN".equals(role);
    }
}
