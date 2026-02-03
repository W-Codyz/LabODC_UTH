package com.uth.labodc.repository;

import com.uth.labodc.model.entity.ProjectMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {
    List<ProjectMember> findByProjectId(Long projectId);
    void deleteByProjectId(Long projectId);
    Integer countByProjectIdAndStatus(Long projectId, String status);
}
