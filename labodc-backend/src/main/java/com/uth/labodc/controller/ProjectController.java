package com.uth.labodc.controller;

import com.uth.labodc.dto.ApiResponse;
import com.uth.labodc.dto.project.CreateProjectRequest;
import com.uth.labodc.dto.project.ProjectMemberResponse;
import com.uth.labodc.dto.project.ProjectResponse;
import com.uth.labodc.exception.ResourceNotFoundException;
import com.uth.labodc.model.entity.User;
import com.uth.labodc.repository.UserRepository;
import com.uth.labodc.service.ProjectDataService;
import com.uth.labodc.service.ProjectService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectDataService projectDataService;
    private final UserRepository userRepository;
    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getProjects(
            @RequestParam(value = "status", required = false) String status
    ) {
        return ResponseEntity.ok(ApiResponse.success(projectDataService.getProjects(status)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProjectResponse>> createProject(
            Authentication authentication,
            @RequestBody CreateProjectRequest request
    ) {
        User user = currentUser(authentication);
        return ResponseEntity.ok(ApiResponse.success(projectDataService.createProject(user, request)));
    }

    @GetMapping("/enterprise/{enterpriseId}")
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getEnterpriseProjects(
            @PathVariable long enterpriseId
    ) {
        return ResponseEntity.ok(ApiResponse.success(projectDataService.getProjectsByEnterprise(enterpriseId)));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getMyProjects(Authentication authentication) {
        User user = currentUser(authentication);
        return ResponseEntity.ok(ApiResponse.success(projectDataService.getProjectsForUser(user)));
    }

    @GetMapping("/{projectId}/members")
    public ResponseEntity<ApiResponse<List<ProjectMemberResponse>>> getProjectMembers(
            @PathVariable long projectId
    ) {
        return ResponseEntity.ok(ApiResponse.success(projectDataService.getProjectMembers(projectId)));
    }

    @PostMapping("/{projectId}/join")
    public ResponseEntity<ApiResponse<String>> joinProject(
            @PathVariable long projectId,
            Authentication authentication,
            @RequestBody(required = false) Map<String, String> payload
    ) {
        User user = currentUser(authentication);
        String motivation = null;
        if (payload != null) {
            motivation = payload.getOrDefault("motivationLetter", payload.get("message"));
        }
        projectDataService.joinProject(projectId, user, motivation);
        return ResponseEntity.ok(ApiResponse.success("Tham gia dự án thành công", null));
    }

    @PostMapping("/{projectId}/leave")
    public ResponseEntity<ApiResponse<String>> leaveProject(
            @PathVariable long projectId,
            Authentication authentication
    ) {
        User user = currentUser(authentication);
        projectDataService.leaveProject(projectId, user);
        return ResponseEntity.ok(ApiResponse.success("Đã rời dự án", null));
    }

    @PutMapping("/{id}/validate")
    @PreAuthorize("hasAnyRole('LAB_ADMIN', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<String>> validateProject(
            @PathVariable Long id,
            Authentication authentication) {
        log.info("Admin {} validating project {}", authentication.getName(), id);
        
        // Get admin user ID from authentication
        Long adminId = 1L; // TODO: Extract from authentication
        
        projectService.validateProject(id, adminId);
        return ResponseEntity.ok(ApiResponse.success("Project validated successfully", null));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('LAB_ADMIN', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteProject(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body,
            Authentication authentication) {
        log.info("Admin {} rejecting/deleting project {}", authentication.getName(), id);
        
        // Get admin user ID from authentication
        Long adminId = 1L; // TODO: Extract from authentication properly
        
        String reason = body != null ? body.get("reason") : null;
        if (reason != null) {
            log.info("Rejection reason: {}", reason);
        }
        
        projectService.deleteProject(id, adminId, reason);
        return ResponseEntity.ok(ApiResponse.success("Project rejected and deleted", null));
    }

    private User currentUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmailAndDeletedAtIsNull(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
