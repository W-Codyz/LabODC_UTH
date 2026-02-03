package com.uth.labodc.repository;

import com.uth.labodc.model.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    List<Payment> findByProjectId(Long projectId);
    
    List<Payment> findByEnterpriseId(Long enterpriseId);
    
    List<Payment> findByStatus(String status);
    
    Optional<Payment> findByPaymentCode(String paymentCode);
    
    Optional<Payment> findByPayosOrderId(String payosOrderId);
}
