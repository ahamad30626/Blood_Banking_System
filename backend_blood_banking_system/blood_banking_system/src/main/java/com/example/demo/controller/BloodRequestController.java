package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.model.BloodRequest;
import com.example.demo.service.BloodRequestService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Blood request REST controller.
 *
 * RBAC:
 *  - GET endpoints: public (anyone can view requests)
 *  - POST: any authenticated user
 *  - PUT /{id}/status: ADMIN only
 *  - DELETE /{id}: ADMIN only
 */
@RestController
@RequestMapping("/api/requests")
public class BloodRequestController {

    @Autowired
    private BloodRequestService bloodRequestService;

    /** Submit a new blood request — requires login */
    @PostMapping
    public ResponseEntity<ApiResponse<BloodRequest>> createRequest(
            @RequestBody BloodRequest request) {
        return ResponseEntity.ok(bloodRequestService.createRequest(request));
    }

    /**
     * Paginated list of all blood requests.
     * GET /api/requests?page=0&size=10&sortBy=requestedAt&direction=desc
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<BloodRequest>>> getAllRequests(
            @RequestParam(defaultValue = "0")           int page,
            @RequestParam(defaultValue = "10")          int size,
            @RequestParam(defaultValue = "requestedAt") String sortBy,
            @RequestParam(defaultValue = "desc")        String direction) {

        Sort sort = direction.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        return ResponseEntity.ok(bloodRequestService.getAllRequests(pageable));
    }

    /** Get single request by ID — NEW endpoint */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BloodRequest>> getRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(bloodRequestService.getById(id));
    }

    /** Update status — ADMIN only */
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<BloodRequest>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            HttpServletRequest request) {

        if (!isAdmin(request)) {
            return ResponseEntity.status(403)
                    .body(ApiResponse.error("Admin access required to update request status."));
        }
        return ResponseEntity.ok(bloodRequestService.updateStatus(id, body.get("status")));
    }

    /** Delete request — ADMIN only */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRequest(
            @PathVariable Long id,
            HttpServletRequest request) {

        if (!isAdmin(request)) {
            return ResponseEntity.status(403)
                    .body(ApiResponse.error("Admin access required to delete a request."));
        }
        return ResponseEntity.ok(bloodRequestService.deleteRequest(id));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private boolean isAdmin(HttpServletRequest request) {
        String role = (String) request.getAttribute("userRole");
        return "ADMIN".equals(role);
    }
}
