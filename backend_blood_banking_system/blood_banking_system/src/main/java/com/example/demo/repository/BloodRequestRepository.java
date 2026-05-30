package com.example.demo.repository;

import com.example.demo.model.BloodRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {
    List<BloodRequest> findByBloodGroup(String bloodGroup);
    List<BloodRequest> findByStatus(String status);
    List<BloodRequest> findAllByOrderByRequestedAtDesc();
}
