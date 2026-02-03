package com.uth.labodc.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "project_members")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectMember {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "project_id", nullable = false)
    private Long projectId;
    
    @Column(name = "talent_id", nullable = false)
    private Long talentId;
    
    @Column(name = "role")
    private String role;
    
    @Column(name = "status")
    private String status;
    
    @Column(name = "joined_at")
    private LocalDateTime joinedAt;
    
    @Column(name = "left_at")
    private LocalDateTime leftAt;
    
    @Column(name = "tasks_assigned")
    private Integer tasksAssigned;
    
    @Column(name = "tasks_completed")
    private Integer tasksCompleted;
    
    @Column(name = "hours_contributed")
    private Integer hoursContributed;
}
