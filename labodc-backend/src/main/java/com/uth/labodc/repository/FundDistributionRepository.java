package com.uth.labodc.repository;

import com.uth.labodc.model.entity.FundDistribution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FundDistributionRepository extends JpaRepository<FundDistribution, Long> {
    
    List<FundDistribution> findByAllocationId(Long allocationId);
    
    List<FundDistribution> findByRecipientTypeAndRecipientId(String recipientType, Long recipientId);
    
    List<FundDistribution> findByStatus(String status);
}
