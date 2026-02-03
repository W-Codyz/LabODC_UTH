package com.uth.labodc.repository;

import com.uth.labodc.model.entity.TalentSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TalentSkillRepository extends JpaRepository<TalentSkill, Long> {
    List<TalentSkill> findByTalentId(Long talentId);
    void deleteByTalentId(Long talentId);
}
