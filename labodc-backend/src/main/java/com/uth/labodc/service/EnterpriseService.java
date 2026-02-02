package com.uth.labodc.service;

import com.uth.labodc.model.entity.Enterprise;
import com.uth.labodc.model.entity.EnterpriseRejection;
import com.uth.labodc.model.enums.EnterpriseStatus;
import com.uth.labodc.repository.EnterpriseRepository;
import com.uth.labodc.repository.EnterpriseRejectionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class EnterpriseService {
    
    private final EnterpriseRepository enterpriseRepository;
    private final EnterpriseRejectionRepository enterpriseRejectionRepository;
    
    @Transactional(readOnly = true)
    public Enterprise findById(Long id) {
        Enterprise enterprise = enterpriseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Enterprise not found with id: " + id));
        
        // Load rejection info if enterprise was rejected
        if (EnterpriseStatus.REJECTED.equals(enterprise.getStatus())) {
            List<EnterpriseRejection> rejections = enterpriseRejectionRepository
                    .findByEnterpriseIdOrderByRejectedAtDesc(id);
            if (!rejections.isEmpty()) {
                EnterpriseRejection latestRejection = rejections.get(0);
                enterprise.setRejectionReason(latestRejection.getRejectionReason());
                enterprise.setRejectedAt(latestRejection.getRejectedAt());
                enterprise.setRejectedBy(latestRejection.getRejectedBy());
            }
        }
        
        return enterprise;
    }
    
    @Transactional(readOnly = true)
    public List<Enterprise> findAll() {
        return enterpriseRepository.findAll();
    }
    
    @Transactional
    public Enterprise verifyEnterprise(Long id, Long verifiedBy) {
        log.info("Verifying enterprise with id: {}", id);
        
        Enterprise enterprise = findById(id);
        
        if (EnterpriseStatus.APPROVED.equals(enterprise.getStatus())) {
            throw new RuntimeException("Enterprise is already approved");
        }
        
        enterprise.setStatus(EnterpriseStatus.APPROVED);
        enterprise.setVerifiedAt(LocalDateTime.now());
        enterprise.setVerifiedBy(verifiedBy);
        
        Enterprise saved = enterpriseRepository.save(enterprise);
        log.info("Enterprise {} approved successfully", id);
        
        return saved;
    }
    
    @Transactional
    public void deleteEnterprise(Long id, Long rejectedBy, String reason) {
        log.info("Rejecting enterprise with id: {}", id);
        
        Enterprise enterprise = findById(id);
        
        // Update enterprise: set status = REJECTED
        enterprise.setStatus(EnterpriseStatus.REJECTED);
        enterprise.setVerifiedAt(LocalDateTime.now());
        enterprise.setVerifiedBy(rejectedBy);
        enterpriseRepository.save(enterprise);
        log.info("Enterprise {} marked as REJECTED", id);
        
        // Save rejection record with rejection reason
        EnterpriseRejection rejection = EnterpriseRejection.builder()
                .enterpriseId(id)
                .rejectedBy(rejectedBy)
                .rejectionReason(reason)
                .rejectedAt(LocalDateTime.now())
                .companyName(enterprise.getCompanyName())
                .taxCode(enterprise.getTaxCode())
                .contactEmail(enterprise.getContactEmail())
                .build();
        
        enterpriseRejectionRepository.save(rejection);
        log.info("Rejection record saved for enterprise {} ({}): {}", id, enterprise.getCompanyName(), reason);
        
        log.info("Enterprise {} rejected successfully", id);
    }
}
