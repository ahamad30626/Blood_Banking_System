package com.example.demo.service;

import com.example.demo.dto.ApiResponse;
import com.example.demo.model.BloodRequest;
import com.example.demo.repository.BloodRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class BloodRequestService {

    @Autowired
    private BloodRequestRepository bloodRequestRepository;

    public ApiResponse<BloodRequest> createRequest(BloodRequest request) {
        request.setStatus("PENDING");
        BloodRequest saved = bloodRequestRepository.save(request);
        return ApiResponse.success("Blood request submitted successfully", saved);
    }

    /** Paginated request list */
    public ApiResponse<Page<BloodRequest>> getAllRequests(Pageable pageable) {
        Page<BloodRequest> requests = bloodRequestRepository.findAll(pageable);
        return ApiResponse.success("Requests fetched successfully", requests);
    }

    /** Get single request — missing endpoint added */
    public ApiResponse<BloodRequest> getById(Long id) {
        return bloodRequestRepository.findById(id)
                .map(r -> ApiResponse.success("Request found", r))
                .orElse(ApiResponse.error("Blood request not found with id: " + id));
    }

    public ApiResponse<BloodRequest> updateStatus(Long id, String status) {
        BloodRequest request = bloodRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blood request not found with id: " + id));
        request.setStatus(status);
        return ApiResponse.success("Status updated to " + status, bloodRequestRepository.save(request));
    }

    public ApiResponse<Void> deleteRequest(Long id) {
        if (!bloodRequestRepository.existsById(id)) {
            return ApiResponse.error("Request not found with id: " + id);
        }
        bloodRequestRepository.deleteById(id);
        return ApiResponse.success("Request deleted", null);
    }
}
