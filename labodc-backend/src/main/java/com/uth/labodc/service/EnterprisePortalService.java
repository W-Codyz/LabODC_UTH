package com.uth.labodc.service;

import com.uth.labodc.dto.enterprise.*;
import com.uth.labodc.exception.ResourceNotFoundException;
import com.uth.labodc.model.entity.User;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class EnterprisePortalService {

    private final NamedParameterJdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper;

    public EnterpriseDashboardSummaryDTO getDashboardSummary(User user) {
        long enterpriseId = requireEnterpriseId(user);
        Map<String, Object> params = Map.of("enterpriseId", enterpriseId);

        String sql = """
                SELECT
                  COUNT(*) AS total_projects,
                  SUM(CASE WHEN status IN ('IN_PROGRESS', 'RECRUITING') THEN 1 ELSE 0 END) AS active_projects,
                  SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed_projects
                FROM projects
                WHERE enterprise_id = :enterpriseId AND deleted_at IS NULL
                """;

        EnterpriseDashboardSummaryDTO summary = jdbcTemplate.query(sql, params, rs -> {
            if (!rs.next()) {
                return EnterpriseDashboardSummaryDTO.builder()
                        .totalProjects(0)
                        .activeProjects(0)
                        .completedProjects(0)
                        .totalSpent(0)
                        .build();
            }
            return EnterpriseDashboardSummaryDTO.builder()
                    .totalProjects(rs.getLong("total_projects"))
                    .activeProjects(rs.getLong("active_projects"))
                    .completedProjects(rs.getLong("completed_projects"))
                    .totalSpent(0)
                    .build();
        });

        String spentSql = """
                SELECT COALESCE(SUM(amount), 0) AS total_spent
                FROM payments
                WHERE enterprise_id = :enterpriseId AND status = 'COMPLETED'
                """;
        Double totalSpent = jdbcTemplate.query(spentSql, params, rs -> rs.next() ? rs.getDouble("total_spent") : 0d);
        summary.setTotalSpent(totalSpent != null ? totalSpent : 0d);

        return summary;
    }

    public List<EnterpriseRecentProjectDTO> getRecentProjects(User user, int limit) {
        long enterpriseId = requireEnterpriseId(user);
        String sql = """
                SELECT id, title, progress_percentage, current_members_count, status
                FROM projects
                WHERE enterprise_id = :enterpriseId AND deleted_at IS NULL
                ORDER BY created_at DESC
                LIMIT :limit
                """;
        return jdbcTemplate.query(sql, Map.of("enterpriseId", enterpriseId, "limit", limit),
                (rs, rowNum) -> EnterpriseRecentProjectDTO.builder()
                        .id(rs.getLong("id"))
                        .name(rs.getString("title"))
                        .progress(rs.getInt("progress_percentage"))
                        .members(rs.getInt("current_members_count"))
                        .status(rs.getString("status"))
                        .build());
    }

    public EnterpriseProjectSummaryDTO getProjectSummary(User user) {
        long enterpriseId = requireEnterpriseId(user);
        String sql = """
                SELECT
                  COUNT(*) AS total_projects,
                  SUM(CASE WHEN status IN ('RECRUITING', 'IN_PROGRESS') THEN 1 ELSE 0 END) AS in_progress,
                  SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed,
                  COALESCE(SUM(budget), 0) AS total_budget
                FROM projects
                WHERE enterprise_id = :enterpriseId AND deleted_at IS NULL
                """;
        return jdbcTemplate.query(sql, Map.of("enterpriseId", enterpriseId), rs -> {
            if (!rs.next()) {
                return EnterpriseProjectSummaryDTO.builder()
                        .total(0).inProgress(0).completed(0).totalBudget(0)
                        .build();
            }
            return EnterpriseProjectSummaryDTO.builder()
                    .total(rs.getLong("total_projects"))
                    .inProgress(rs.getLong("in_progress"))
                    .completed(rs.getLong("completed"))
                    .totalBudget(rs.getDouble("total_budget"))
                    .build();
        });
    }

    public List<EnterpriseProjectItemDTO> getProjects(User user, String status) {
        long enterpriseId = requireEnterpriseId(user);
        String base = """
                SELECT p.id, p.title, p.budget, p.progress_percentage, p.status,
                       COALESCE(spent.total_spent, 0) AS spent
                FROM projects p
                LEFT JOIN (
                    SELECT project_id, SUM(amount) AS total_spent
                    FROM payments
                    WHERE status = 'COMPLETED'
                    GROUP BY project_id
                ) spent ON spent.project_id = p.id
                WHERE p.enterprise_id = :enterpriseId AND p.deleted_at IS NULL
                """;
        StringBuilder sql = new StringBuilder(base);
        Map<String, Object> params = new java.util.HashMap<>();
        params.put("enterpriseId", enterpriseId);
        if (status != null && !status.equalsIgnoreCase("ALL")) {
            sql.append(" AND p.status = :status");
            params.put("status", status);
        }
        sql.append(" ORDER BY p.created_at DESC");

        return jdbcTemplate.query(sql.toString(), params, (rs, rowNum) -> EnterpriseProjectItemDTO.builder()
                .key(String.valueOf(rs.getLong("id")))
                .name(rs.getString("title"))
                .budget(rs.getDouble("budget"))
                .spent(rs.getDouble("spent"))
                .progress(rs.getInt("progress_percentage"))
                .status(rs.getString("status"))
                .build());
    }

    public void updateProject(User user, long projectId, UpdateEnterpriseProjectRequest request) {
        long enterpriseId = requireEnterpriseId(user);
        ProjectMeta meta = requireEnterpriseProject(projectId, enterpriseId);
        if (!"PENDING_VALIDATION".equalsIgnoreCase(meta.status())) {
            throw new IllegalStateException("Chỉ dự án chờ duyệt mới được chỉnh sửa");
        }

        String objectivesJson = null;
        if (request.getObjectives() != null) {
            try {
                objectivesJson = objectMapper.writeValueAsString(request.getObjectives());
            } catch (JsonProcessingException e) {
                throw new IllegalArgumentException("Không thể lưu mục tiêu dự án");
            }
        }

        String sql = """
                UPDATE projects
                SET title = COALESCE(:title, title),
                    description = COALESCE(:description, description),
                    objectives = COALESCE(:objectives, objectives),
                    requirements = COALESCE(:requirements, requirements),
                    start_date = COALESCE(:startDate, start_date),
                    end_date = COALESCE(:endDate, end_date),
                    budget = COALESCE(:budget, budget),
                    number_of_students = COALESCE(:numberOfStudents, number_of_students),
                    allow_applications = COALESCE(:allowApplications, allow_applications),
                    updated_at = NOW()
                WHERE id = :projectId AND enterprise_id = :enterpriseId
                """;

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("projectId", projectId)
                .addValue("enterpriseId", enterpriseId)
                .addValue("title", request.getName())
                .addValue("description", request.getDescription())
                .addValue("objectives", objectivesJson)
                .addValue("requirements", request.getRequirements())
                .addValue("startDate", request.getStartDate())
                .addValue("endDate", request.getEndDate())
                .addValue("budget", request.getBudget())
                .addValue("numberOfStudents", request.getRequiredTalents())
                .addValue("allowApplications", request.getAllowApplications());

        jdbcTemplate.update(sql, params);

        if (request.getTechnologies() != null) {
            jdbcTemplate.update("DELETE FROM project_technologies WHERE project_id = :projectId",
                    Map.of("projectId", projectId));
            insertTechnologies(projectId, request.getTechnologies());
        }

        if (request.getRequiredSkills() != null) {
            jdbcTemplate.update("DELETE FROM project_skill_requirements WHERE project_id = :projectId",
                    Map.of("projectId", projectId));
            insertSkills(projectId, request.getRequiredSkills());
        }
    }

    public void deleteProject(User user, long projectId) {
        long enterpriseId = requireEnterpriseId(user);
        ProjectMeta meta = requireEnterpriseProject(projectId, enterpriseId);
        if (!"PENDING_VALIDATION".equalsIgnoreCase(meta.status())) {
            throw new IllegalStateException("Chỉ dự án chờ duyệt mới được xóa");
        }
        jdbcTemplate.update("""
                        UPDATE projects SET deleted_at = NOW()
                        WHERE id = :projectId AND enterprise_id = :enterpriseId
                        """,
                Map.of("projectId", projectId, "enterpriseId", enterpriseId));
    }

    public EnterpriseProposalSummaryDTO getProposalSummary(User user) {
        long enterpriseId = requireEnterpriseId(user);
        String sql = """
                SELECT
                  COUNT(*) AS total,
                  SUM(CASE WHEN proposal_status = 'PENDING' THEN 1 ELSE 0 END) AS pending,
                  SUM(CASE WHEN proposal_status = 'APPROVED' THEN 1 ELSE 0 END) AS approved,
                  COALESCE(SUM(budget), 0) AS total_budget
                FROM (
                  SELECT budget,
                         CASE
                           WHEN status = 'REJECTED' THEN 'REJECTED'
                           WHEN validated = TRUE OR status IN ('VALIDATED', 'RECRUITING', 'IN_PROGRESS', 'COMPLETED') THEN 'APPROVED'
                           ELSE 'PENDING'
                         END AS proposal_status
                  FROM projects
                  WHERE enterprise_id = :enterpriseId AND deleted_at IS NULL
                ) t
                """;
        return jdbcTemplate.query(sql, Map.of("enterpriseId", enterpriseId), rs -> {
            if (!rs.next()) {
                return EnterpriseProposalSummaryDTO.builder()
                        .total(0).pending(0).approved(0).totalBudget(0)
                        .build();
            }
            return EnterpriseProposalSummaryDTO.builder()
                    .total(rs.getLong("total"))
                    .pending(rs.getLong("pending"))
                    .approved(rs.getLong("approved"))
                    .totalBudget(rs.getDouble("total_budget"))
                    .build();
        });
    }

    public List<EnterpriseProposalDTO> getProposals(User user, String status) {
        long enterpriseId = requireEnterpriseId(user);
        String sql = """
                SELECT id, title, budget, created_at,
                       CASE
                         WHEN status = 'REJECTED' THEN 'REJECTED'
                         WHEN validated = TRUE OR status IN ('VALIDATED', 'RECRUITING', 'IN_PROGRESS', 'COMPLETED') THEN 'APPROVED'
                         ELSE 'PENDING'
                       END AS proposal_status
                FROM projects
                WHERE enterprise_id = :enterpriseId AND deleted_at IS NULL
                """;
        StringBuilder sb = new StringBuilder(sql);
        Map<String, Object> params = new java.util.HashMap<>();
        params.put("enterpriseId", enterpriseId);
        if (status != null && !status.equalsIgnoreCase("ALL")) {
            sb.append(" AND (");
            sb.append("CASE WHEN status = 'REJECTED' THEN 'REJECTED' ");
            sb.append("WHEN validated = TRUE OR status IN ('VALIDATED', 'RECRUITING', 'IN_PROGRESS', 'COMPLETED') THEN 'APPROVED' ");
            sb.append("ELSE 'PENDING' END) = :status");
            params.put("status", status);
        }
        sb.append(" ORDER BY created_at DESC");

        return jdbcTemplate.query(sb.toString(), params, (rs, rowNum) -> EnterpriseProposalDTO.builder()
                .key(String.valueOf(rs.getLong("id")))
                .name(rs.getString("title"))
                .budget(rs.getDouble("budget"))
                .status(rs.getString("proposal_status"))
                .createdAt(toLocalDateTime(rs.getTimestamp("created_at")))
                .build());
    }

    public EnterprisePaymentSummaryDTO getPaymentSummary(User user) {
        long enterpriseId = requireEnterpriseId(user);
        String sql = """
                SELECT
                  SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) AS paid,
                  SUM(CASE WHEN status != 'COMPLETED' AND (payment_link_expires_at IS NULL OR payment_link_expires_at >= NOW()) THEN 1 ELSE 0 END) AS pending,
                  SUM(CASE WHEN status != 'COMPLETED' AND payment_link_expires_at < NOW() THEN 1 ELSE 0 END) AS overdue,
                  COALESCE(SUM(CASE WHEN status != 'COMPLETED' THEN amount ELSE 0 END), 0) AS remaining
                FROM payments
                WHERE enterprise_id = :enterpriseId
                """;
        return jdbcTemplate.query(sql, Map.of("enterpriseId", enterpriseId), rs -> {
            if (!rs.next()) {
                return EnterprisePaymentSummaryDTO.builder()
                        .paid(0).pending(0).overdue(0).remaining(0)
                        .build();
            }
            return EnterprisePaymentSummaryDTO.builder()
                    .paid(rs.getLong("paid"))
                    .pending(rs.getLong("pending"))
                    .overdue(rs.getLong("overdue"))
                    .remaining(rs.getDouble("remaining"))
                    .build();
        });
    }

    public List<EnterprisePaymentDTO> getPayments(User user) {
        long enterpriseId = requireEnterpriseId(user);
        String sql = """
                SELECT p.id, p.payment_code, p.amount, p.payment_link_expires_at, p.status, pr.title
                FROM payments p
                JOIN projects pr ON pr.id = p.project_id
                WHERE p.enterprise_id = :enterpriseId
                ORDER BY p.created_at DESC
                """;
        return jdbcTemplate.query(sql, Map.of("enterpriseId", enterpriseId), new PaymentRowMapper());
    }

    public EnterprisePaymentDTO createPayment(User user, CreateEnterprisePaymentRequest request) {
        long enterpriseId = requireEnterpriseId(user);
        validateProjectOwnership(request.getProjectId(), enterpriseId);

        String code = "PMT-" + System.currentTimeMillis();
        LocalDate due = request.getDueDate();
        LocalDateTime dueDateTime = due != null ? due.atStartOfDay() : null;

        String sql = """
                INSERT INTO payments (project_id, enterprise_id, payment_code, amount, currency, status,
                                      payment_method, payment_link_expires_at, description, created_at)
                VALUES (:projectId, :enterpriseId, :paymentCode, :amount, 'VND', 'PENDING',
                        :paymentMethod, :dueDate, :description, NOW())
                """;

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("projectId", request.getProjectId())
                .addValue("enterpriseId", enterpriseId)
                .addValue("paymentCode", code)
                .addValue("amount", request.getAmount())
                .addValue("paymentMethod", request.getPaymentMethod())
                .addValue("dueDate", dueDateTime)
                .addValue("description", request.getDescription());

        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(sql, params, keyHolder, new String[]{"id"});
        Number id = keyHolder.getKey();
        if (id == null) {
            throw new IllegalStateException("Không thể tạo yêu cầu thanh toán");
        }

        return getPaymentById(id.longValue(), enterpriseId);
    }

    public EnterpriseReportSummaryDTO getReportSummary(User user) {
        long enterpriseId = requireEnterpriseId(user);
        String sql = """
                SELECT
                  COUNT(*) AS total_projects,
                  COALESCE(SUM(budget), 0) AS total_cost,
                  COALESCE(AVG(progress_percentage), 0) AS avg_progress,
                  SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed_projects
                FROM projects
                WHERE enterprise_id = :enterpriseId AND deleted_at IS NULL
                """;
        return jdbcTemplate.query(sql, Map.of("enterpriseId", enterpriseId), rs -> {
            if (!rs.next()) {
                return EnterpriseReportSummaryDTO.builder()
                        .projects(0).totalCost(0).performance(0).completedRate(0)
                        .build();
            }
            long totalProjects = rs.getLong("total_projects");
            long completed = rs.getLong("completed_projects");
            double completedRate = totalProjects == 0 ? 0 : (completed * 100.0) / totalProjects;
            return EnterpriseReportSummaryDTO.builder()
                    .projects(totalProjects)
                    .totalCost(rs.getDouble("total_cost"))
                    .performance(rs.getDouble("avg_progress"))
                    .completedRate(completedRate)
                    .build();
        });
    }

    private EnterprisePaymentDTO getPaymentById(long paymentId, long enterpriseId) {
        String sql = """
                SELECT p.id, p.payment_code, p.amount, p.payment_link_expires_at, p.status, pr.title
                FROM payments p
                JOIN projects pr ON pr.id = p.project_id
                WHERE p.id = :paymentId AND p.enterprise_id = :enterpriseId
                """;
        List<EnterprisePaymentDTO> rows = jdbcTemplate.query(sql, Map.of("paymentId", paymentId, "enterpriseId", enterpriseId), new PaymentRowMapper());
        if (rows.isEmpty()) {
            throw new ResourceNotFoundException("Payment not found");
        }
        return rows.get(0);
    }

    public List<EnterpriseProjectReportDTO> getProjectReports(User user) {
        long enterpriseId = requireEnterpriseId(user);
        String sql = """
                SELECT id, title, budget, progress_percentage, status
                FROM projects
                WHERE enterprise_id = :enterpriseId AND deleted_at IS NULL
                ORDER BY created_at DESC
                """;
        return jdbcTemplate.query(sql, Map.of("enterpriseId", enterpriseId), (rs, rowNum) -> EnterpriseProjectReportDTO.builder()
                .key(String.valueOf(rs.getLong("id")))
                .name(rs.getString("title"))
                .cost(rs.getDouble("budget"))
                .progress(rs.getInt("progress_percentage"))
                .status(rs.getString("status"))
                .build());
    }

    private long requireEnterpriseId(User user) {
        Optional<Long> enterpriseId = jdbcTemplate.query(
                "SELECT id FROM enterprises WHERE user_id = :userId AND deleted_at IS NULL",
                Map.of("userId", user.getId()),
                (rs, rowNum) -> rs.getLong("id")
        ).stream().findFirst();
        return enterpriseId.orElseThrow(() -> new ResourceNotFoundException("Enterprise not found for user"));
    }

    private void validateProjectOwnership(Long projectId, long enterpriseId) {
        if (projectId == null) {
            throw new IllegalArgumentException("Thiếu projectId");
        }
        Integer count = jdbcTemplate.query("""
                        SELECT COUNT(*) AS cnt
                        FROM projects
                        WHERE id = :projectId AND enterprise_id = :enterpriseId AND deleted_at IS NULL
                        """,
                Map.of("projectId", projectId, "enterpriseId", enterpriseId),
                rs -> rs.next() ? rs.getInt("cnt") : 0);
        if (count == null || count == 0) {
            throw new ResourceNotFoundException("Project not found for enterprise");
        }
    }

    private ProjectMeta requireEnterpriseProject(long projectId, long enterpriseId) {
        String sql = """
                SELECT id, status
                FROM projects
                WHERE id = :projectId AND enterprise_id = :enterpriseId AND deleted_at IS NULL
                """;
        List<ProjectMeta> rows = jdbcTemplate.query(sql, Map.of("projectId", projectId, "enterpriseId", enterpriseId),
                (rs, rowNum) -> new ProjectMeta(rs.getLong("id"), rs.getString("status")));
        if (rows.isEmpty()) {
            throw new ResourceNotFoundException("Project not found for enterprise");
        }
        return rows.get(0);
    }

    private void insertTechnologies(long projectId, List<String> technologies) {
        if (technologies == null || technologies.isEmpty()) {
            return;
        }
        String sql = "INSERT INTO project_technologies (project_id, technology_name) VALUES (:projectId, :name)";
        technologies.stream()
                .filter(t -> t != null && !t.trim().isEmpty())
                .map(String::trim)
                .distinct()
                .forEach(tech -> jdbcTemplate.update(sql, Map.of("projectId", projectId, "name", tech)));
    }

    private void insertSkills(long projectId, List<String> skills) {
        if (skills == null || skills.isEmpty()) {
            return;
        }
        String sql = "INSERT INTO project_skill_requirements (project_id, skill_name, proficiency_level, priority) VALUES (:projectId, :name, :level, :priority)";
        List<String> sorted = skills.stream()
                .filter(s -> s != null && !s.trim().isEmpty())
                .map(String::trim)
                .distinct()
                .sorted()
                .toList();
        for (int i = 0; i < sorted.size(); i++) {
            jdbcTemplate.update(sql, Map.of(
                    "projectId", projectId,
                    "name", sorted.get(i),
                    "level", "INTERMEDIATE",
                    "priority", i + 1
            ));
        }
    }

    private static LocalDateTime toLocalDateTime(Timestamp ts) {
        return ts != null ? ts.toLocalDateTime() : null;
    }

    private static class PaymentRowMapper implements RowMapper<EnterprisePaymentDTO> {
        @Override
        public EnterprisePaymentDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            String status = rs.getString("status");
            LocalDateTime dueDate = toLocalDateTime(rs.getTimestamp("payment_link_expires_at"));
            String mappedStatus;
            if ("COMPLETED".equalsIgnoreCase(status)) {
                mappedStatus = "PAID";
            } else if (dueDate != null && dueDate.isBefore(LocalDateTime.now())) {
                mappedStatus = "OVERDUE";
            } else {
                mappedStatus = "PENDING";
            }
            return EnterprisePaymentDTO.builder()
                    .key(String.valueOf(rs.getLong("id")))
                    .code(rs.getString("payment_code"))
                    .project(rs.getString("title"))
                    .amount(rs.getDouble("amount"))
                    .dueDate(dueDate)
                    .status(mappedStatus)
                    .build();
        }
    }

    private record ProjectMeta(long id, String status) {
    }
}
