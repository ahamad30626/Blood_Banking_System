package com.example.demo.service;

import com.example.demo.dto.ApiResponse;
import com.example.demo.model.Donor;
import com.example.demo.repository.DonorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DonorService {

    @Autowired
    private DonorRepository donorRepository;

    public ApiResponse<Donor> registerDonor(Donor donor) {
        Donor saved = donorRepository.save(donor);
        return ApiResponse.success("Donor registered successfully", saved);
    }

    /** Paginated donor list */
    public ApiResponse<Page<Donor>> getAllDonors(Pageable pageable) {
        Page<Donor> donors = donorRepository.findAll(pageable);
        return ApiResponse.success("Donors fetched successfully", donors);
    }

    public ApiResponse<Donor> getDonorById(Long id) {
        return donorRepository.findById(id)
                .map(d -> ApiResponse.success("Donor found", d))
                .orElse(ApiResponse.error("Donor not found with id: " + id));
    }

    public ApiResponse<Donor> donorLogin(String username, String password) {
        Optional<Donor> donor = donorRepository.findByUsernameAndPassword(username, password);
        if (donor.isPresent()) {
            return ApiResponse.success("Donor login successful", donor.get());
        }
        return ApiResponse.error("Invalid donor username or password");
    }

    public ApiResponse<Donor> updateAvailability(Long id, Boolean available) {
        Donor donor = donorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donor not found with id: " + id));
        donor.setAvailable(available != null ? available : true);
        return ApiResponse.success("Availability updated", donorRepository.save(donor));
    }
}
