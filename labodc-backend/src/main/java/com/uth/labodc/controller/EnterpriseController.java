package com.uth.labodc.controller;

import com.uth.labodc.dto.ApiResponse;
import com.uth.labodc.dto.enterprise.EnterpriseListDTO;
import com.uth.labodc.dto.enterprise.EnterpriseStatsDTO;
import com.uth.labodc.model.entity.Enterprise;
import com.uth.labodc.model.enums.EnterpriseStatus;
import com.uth.labodc.service.EnterpriseService;
import com.uth.labodc.service.EnterpriseManagementService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/enterprises")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class EnterpriseController {
    
    private final EnterpriseService enterpriseService;
    private final EnterpriseManagementService enterpriseManagementService;
    
    @GetMapping
    @PreAuthorize("hasAnyRole('LAB_ADMIN', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<List<Enterprise>>> getAllEnterprises() {
        log.info("Fetching all enterprises");
        List<Enterprise> enterprises = enterpriseService.findAll();
        return ResponseEntity.ok(ApiResponse.success(enterprises));
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('LAB_ADMIN', 'SYSTEM_ADMIN', 'ENTERPRISE')")
    public ResponseEntity<ApiResponse<Enterprise>> getEnterpriseById(@PathVariable Long id) {
        log.info("Fetching enterprise with id: {}", id);
        Enterprise enterprise = enterpriseService.findById(id);
        return ResponseEntity.ok(ApiResponse.success(enterprise));
    }
    
    @PutMapping("/{id}/verify")
    @PreAuthorize("hasAnyRole('LAB_ADMIN', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<Enterprise>> verifyEnterprise(
            @PathVariable Long id,
            Authentication authentication) {
        log.info("Admin {} verifying enterprise {}", authentication.getName(), id);
        
        // Get admin user ID from authentication (you may need to adjust this based on your auth implementation)
        Long adminId = 1L; // TODO: Extract from authentication
        
        Enterprise verified = enterpriseService.verifyEnterprise(id, adminId);
        return ResponseEntity.ok(ApiResponse.success("Enterprise verified successfully", verified));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('LAB_ADMIN', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteEnterprise(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body,
            Authentication authentication) {
        log.info("Admin {} rejecting/deleting enterprise {}", authentication.getName(), id);
        
        // Get admin user ID from authentication
        Long adminId = 1L; // TODO: Extract from authentication properly
        
        String reason = body != null ? body.get("reason") : null;
        if (reason != null) {
            log.info("Rejection reason: {}", reason);
        }
        
        enterpriseService.deleteEnterprise(id, adminId, reason);
        return ResponseEntity.ok(ApiResponse.success("Enterprise rejected and deleted", null));
    }
    
    // Management endpoints
    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('LAB_ADMIN', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<EnterpriseStatsDTO>> getEnterpriseStats() {
        log.info("Fetching enterprise statistics");
        EnterpriseStatsDTO stats = enterpriseManagementService.getEnterpriseStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
    
    @GetMapping("/management")
    @PreAuthorize("hasAnyRole('LAB_ADMIN', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<List<EnterpriseListDTO>>> getEnterprisesForManagement(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        log.info("Fetching enterprises for management, status filter: {}, search: {}", status, search);
        
        // Convert string to enum
        EnterpriseStatus statusFilter = null;
        if (status != null && !status.isEmpty()) {
            try {
                statusFilter = EnterpriseStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                log.warn("Invalid status value: {}", status);
                return ResponseEntity.badRequest().body(ApiResponse.error("Invalid status value: " + status));
            }
        }
        
        List<EnterpriseListDTO> enterprises = enterpriseManagementService.getAllEnterprisesWithStats(statusFilter, search);
        return ResponseEntity.ok(ApiResponse.success(enterprises));
    }
}
