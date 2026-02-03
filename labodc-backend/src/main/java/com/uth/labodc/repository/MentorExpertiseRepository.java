package com.uth.labodc.repository;

import com.uth.labodc.model.entity.MentorExpertise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MentorExpertiseRepository extends JpaRepository<MentorExpertise, Long> {
    List<MentorExpertise> findByMentorId(Long mentorId);
    void deleteByMentorId(Long mentorId);
}
