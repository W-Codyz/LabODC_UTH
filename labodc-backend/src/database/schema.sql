-- =====================================================
-- LabODC UTH — Clean Database Schema
-- Chỉ gồm các table đang được sử dụng trong code
-- =====================================================

-- Xoá nếu đã tồn tại (reset sạch)
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE user_role_enum AS ENUM (
    'SYSTEM_ADMIN', 'LAB_ADMIN', 'ENTERPRISE', 'TALENT', 'TALENT_LEADER', 'MENTOR'
);

CREATE TYPE user_status_enum AS ENUM (
    'PENDING', 'ACTIVE', 'INACTIVE', 'LOCKED', 'SUSPENDED'
);

CREATE TYPE enterprise_status_enum AS ENUM (
    'PENDING', 'APPROVED', 'REJECTED'
);

CREATE TYPE invitation_status_enum AS ENUM (
    'PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED'
);

CREATE TYPE proficiency_level_enum AS ENUM (
    'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'
);

CREATE TYPE project_status_enum AS ENUM (
    'DRAFT', 'PENDING_VALIDATION', 'VALIDATED', 'REJECTED',
    'RECRUITING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED', 'ARCHIVED'
);

CREATE TYPE project_member_role_enum AS ENUM ('MEMBER', 'LEADER');

CREATE TYPE project_member_status_enum AS ENUM ('ACTIVE', 'LEFT', 'REMOVED');

CREATE TYPE payment_status_enum AS ENUM (
    'PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED', 'EXPIRED'
);

CREATE TYPE fund_allocation_status_enum AS ENUM (
    'ALLOCATED', 'DISTRIBUTED', 'COMPLETED'
);

CREATE TYPE fund_distribution_status_enum AS ENUM (
    'PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'ON_HOLD'
);

CREATE TYPE team_fund_status_enum AS ENUM (
    'DRAFT', 'SUBMITTED', 'APPROVED_BY_MENTOR', 'APPROVED_BY_LAB', 'REJECTED', 'DISBURSED'
);

CREATE TYPE recipient_type_enum AS ENUM ('TEAM', 'MENTOR', 'LAB', 'TALENT');

CREATE TYPE advance_reason_enum AS ENUM ('PAYMENT_DELAY', 'EMERGENCY', 'OTHER');

CREATE TYPE repayment_status_enum AS ENUM (
    'OUTSTANDING', 'PARTIALLY_REPAID', 'FULLY_REPAID'
);

CREATE TYPE report_status_enum AS ENUM (
    'DRAFT', 'SUBMITTED', 'REVIEWED', 'PUBLISHED', 'ARCHIVED'
);

CREATE TYPE report_type_enum AS ENUM (
    'WEEKLY', 'MONTHLY', 'MILESTONE', 'FINAL', 'QUARTERLY', 'ANNUAL'
);

CREATE TYPE evaluation_grade_enum AS ENUM ('A', 'B', 'C', 'D', 'F');

-- =====================================================
-- 1. USERS
-- =====================================================

CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    email       VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role        user_role_enum NOT NULL,
    status      user_status_enum NOT NULL DEFAULT 'PENDING',
    email_verified          BOOLEAN DEFAULT FALSE,
    email_verified_at       TIMESTAMP,
    verification_token      VARCHAR(255),
    phone                   VARCHAR(20),
    failed_login_attempts   INTEGER DEFAULT 0,
    locked_until            TIMESTAMP,
    last_login_at           TIMESTAMP,
    avatar_url              VARCHAR(500),           -- lưu URL trực tiếp thay vì FK files
    timezone                VARCHAR(50) DEFAULT 'Asia/Ho_Chi_Minh',
    language                VARCHAR(10) DEFAULT 'vi',
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at              TIMESTAMP,
    CONSTRAINT check_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role   ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- =====================================================
-- 2. ENTERPRISES
-- =====================================================

CREATE TABLE enterprises (
    id                      BIGSERIAL PRIMARY KEY,
    user_id                 BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    company_name            VARCHAR(255) NOT NULL,
    tax_code                VARCHAR(20)  NOT NULL UNIQUE,
    business_license_number VARCHAR(50),
    address                 TEXT,
    city                    VARCHAR(100),
    district                VARCHAR(100),
    ward                    VARCHAR(100),
    representative_name     VARCHAR(255) NOT NULL,
    representative_position VARCHAR(100),
    contact_email           VARCHAR(255),
    contact_phone           VARCHAR(20),
    website                 VARCHAR(255),
    industry                VARCHAR(100),
    company_size            VARCHAR(50),
    year_established        INTEGER,
    description             TEXT,
    logo_url                VARCHAR(500),           -- URL trực tiếp thay vì FK files
    status                  enterprise_status_enum NOT NULL DEFAULT 'PENDING',
    verified_at             TIMESTAMP,
    verified_by             BIGINT REFERENCES users(id) ON DELETE SET NULL,
    verification_note       TEXT,
    rating_average          NUMERIC(3,2) DEFAULT 0.00,
    total_projects          INTEGER DEFAULT 0,
    successful_projects     INTEGER DEFAULT 0,
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at              TIMESTAMP,
    CONSTRAINT check_tax_code  CHECK (tax_code ~* '^[0-9]{10,13}$'),
    CONSTRAINT check_rating    CHECK (rating_average >= 0 AND rating_average <= 5)
);

CREATE INDEX idx_enterprises_status  ON enterprises(status);
CREATE INDEX idx_enterprises_user_id ON enterprises(user_id);

-- =====================================================
-- 3. ENTERPRISE REJECTIONS
-- =====================================================

CREATE TABLE enterprise_rejections (
    id               BIGSERIAL PRIMARY KEY,
    enterprise_id    BIGINT REFERENCES enterprises(id) ON DELETE SET NULL,
    rejected_by      BIGINT NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    rejection_reason TEXT,
    rejected_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    company_name     VARCHAR(255),
    tax_code         VARCHAR(50),
    contact_email    VARCHAR(255)
);

-- =====================================================
-- 4. MENTORS
-- =====================================================

CREATE TABLE mentors (
    id                      BIGSERIAL PRIMARY KEY,
    user_id                 BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE RESTRICT,
    full_name               VARCHAR(255) NOT NULL,
    title                   VARCHAR(100),
    bio                     TEXT,
    years_of_experience     INTEGER,
    current_position        VARCHAR(255),
    current_company         VARCHAR(255),
    specialization          TEXT,
    industries              JSONB,
    linkedin_url            VARCHAR(500),
    github_url              VARCHAR(500),
    personal_website        VARCHAR(500),
    max_concurrent_projects INTEGER DEFAULT 3,
    current_projects_count  INTEGER DEFAULT 0,
    hours_per_week_available INTEGER,
    hourly_rate             NUMERIC(10,2),
    preferred_payment_method VARCHAR(50),
    bank_account_info       JSONB,
    rating_average          NUMERIC(3,2) DEFAULT 0.00,
    total_projects          INTEGER DEFAULT 0,
    total_students_mentored INTEGER DEFAULT 0,
    available               BOOLEAN DEFAULT TRUE,
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at              TIMESTAMP,
    CONSTRAINT check_rating CHECK (rating_average >= 0 AND rating_average <= 5)
);

CREATE INDEX idx_mentors_available ON mentors(available);

-- =====================================================
-- 5. MENTOR EXPERTISE
-- =====================================================

CREATE TABLE mentor_expertise (
    id                  BIGSERIAL PRIMARY KEY,
    mentor_id           BIGINT NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
    skill_name          VARCHAR(100) NOT NULL,
    skill_category      VARCHAR(50),
    proficiency_level   proficiency_level_enum NOT NULL,
    years_of_experience NUMERIC(4,1),
    can_teach           BOOLEAN DEFAULT TRUE,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (mentor_id, skill_name),
    CONSTRAINT check_mentor_proficiency CHECK (
        proficiency_level IN ('INTERMEDIATE', 'ADVANCED', 'EXPERT')
    )
);

-- =====================================================
-- 6. TALENTS
-- =====================================================

CREATE TABLE talents (
    id                      BIGSERIAL PRIMARY KEY,
    user_id                 BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name               VARCHAR(255) NOT NULL,
    student_id              VARCHAR(20)  NOT NULL,
    date_of_birth           DATE,
    gender                  VARCHAR(10),
    faculty                 VARCHAR(100),
    major                   VARCHAR(100),
    year_of_study           INTEGER,
    gpa                     NUMERIC(3,2),
    expected_graduation     DATE,
    address                 TEXT,
    city                    VARCHAR(100),
    emergency_contact       VARCHAR(20),
    emergency_contact_name  VARCHAR(255),
    bio                     TEXT,
    portfolio_url           VARCHAR(500),
    github_url              VARCHAR(500),
    linkedin_url            VARCHAR(500),
    cv_url                  VARCHAR(500),           -- URL trực tiếp thay vì FK files
    career_goals            TEXT,
    preferred_technologies  JSONB,
    work_availability       VARCHAR(50),
    hours_per_week          INTEGER,
    rating_average          NUMERIC(3,2) DEFAULT 0.00,
    total_projects          INTEGER DEFAULT 0,
    completed_projects      INTEGER DEFAULT 0,
    total_tasks_completed   INTEGER DEFAULT 0,
    available_for_projects  BOOLEAN DEFAULT TRUE,
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at              TIMESTAMP,
    CONSTRAINT check_gpa           CHECK (gpa >= 0 AND gpa <= 4.0),
    CONSTRAINT check_rating        CHECK (rating_average >= 0 AND rating_average <= 10),
    CONSTRAINT check_year_of_study CHECK (year_of_study >= 1 AND year_of_study <= 6)
);

CREATE INDEX idx_talents_user_id    ON talents(user_id);
CREATE INDEX idx_talents_student_id ON talents(student_id);
CREATE INDEX idx_talents_available  ON talents(available_for_projects);

-- =====================================================
-- 7. TALENT SKILLS
-- =====================================================

CREATE TABLE talent_skills (
    id                  BIGSERIAL PRIMARY KEY,
    talent_id           BIGINT NOT NULL REFERENCES talents(id) ON DELETE CASCADE,
    skill_name          VARCHAR(100) NOT NULL,
    skill_category      VARCHAR(50),
    proficiency_level   proficiency_level_enum NOT NULL,
    years_of_experience NUMERIC(3,1),
    last_used_date      DATE,
    verified            BOOLEAN DEFAULT FALSE,
    verified_by         BIGINT REFERENCES users(id) ON DELETE SET NULL,
    verified_at         TIMESTAMP,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (talent_id, skill_name)
);

-- =====================================================
-- 8. TALENT CERTIFICATIONS
-- =====================================================

CREATE TABLE talent_certifications (
    id                  BIGSERIAL PRIMARY KEY,
    talent_id           BIGINT NOT NULL REFERENCES talents(id) ON DELETE CASCADE,
    name                VARCHAR(255) NOT NULL,
    issuer              VARCHAR(255),
    credential_id       VARCHAR(100),
    credential_url      VARCHAR(500),
    issue_date          DATE NOT NULL,
    expiry_date         DATE,
    certificate_url     VARCHAR(500),           -- URL trực tiếp thay vì FK files
    description         TEXT,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 9. PROJECTS
-- =====================================================

CREATE TABLE projects (
    id                      BIGSERIAL PRIMARY KEY,
    enterprise_id           BIGINT NOT NULL REFERENCES enterprises(id) ON DELETE CASCADE,
    mentor_id               BIGINT REFERENCES mentors(id) ON DELETE SET NULL,
    title                   VARCHAR(255) NOT NULL,
    slug                    VARCHAR(255) NOT NULL UNIQUE,
    description             TEXT NOT NULL,
    objectives              JSONB,
    requirements            TEXT,
    start_date              DATE NOT NULL,
    end_date                DATE NOT NULL,
    actual_start_date       DATE,
    actual_end_date         DATE,
    budget                  NUMERIC(15,2) NOT NULL,
    currency                VARCHAR(10) DEFAULT 'VND',
    number_of_students      INTEGER NOT NULL,
    current_members_count   INTEGER DEFAULT 0,
    status                  project_status_enum NOT NULL DEFAULT 'DRAFT',
    validated               VARCHAR(20) NOT NULL DEFAULT 'pending',
    progress_percentage     INTEGER DEFAULT 0,
    validated_at            TIMESTAMP,
    validated_by            BIGINT REFERENCES users(id),
    validation_note         TEXT,
    rejection_reason        TEXT,
    is_public               BOOLEAN DEFAULT TRUE,
    allow_applications      BOOLEAN DEFAULT TRUE,
    published_at            TIMESTAMP,
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at              TIMESTAMP,
    CONSTRAINT check_budget          CHECK (budget > 0),
    CONSTRAINT check_dates           CHECK (end_date > start_date),
    CONSTRAINT check_progress        CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    CONSTRAINT check_students        CHECK (number_of_students >= 3 AND number_of_students <= 10),
    CONSTRAINT check_validation_status CHECK (validated IN ('pending', 'approved', 'rejected'))
);

CREATE INDEX idx_projects_enterprise ON projects(enterprise_id);
CREATE INDEX idx_projects_mentor     ON projects(mentor_id);
CREATE INDEX idx_projects_status     ON projects(status);
CREATE INDEX idx_projects_deleted    ON projects(deleted_at) WHERE deleted_at IS NULL;

-- =====================================================
-- 10. PROJECT MEMBERS
-- =====================================================

CREATE TABLE project_members (
    id              BIGSERIAL PRIMARY KEY,
    project_id      BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    talent_id       BIGINT NOT NULL REFERENCES talents(id) ON DELETE CASCADE,
    role            project_member_role_enum DEFAULT 'MEMBER',
    status          project_member_status_enum DEFAULT 'ACTIVE',
    join_message    TEXT,
    joined_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    left_at         TIMESTAMP,
    tasks_assigned  INTEGER DEFAULT 0,
    tasks_completed INTEGER DEFAULT 0,
    hours_contributed INTEGER DEFAULT 0,
    approved_by     BIGINT,
    approved_at     TIMESTAMP,
    created_at      TIMESTAMP DEFAULT now(),
    updated_at      TIMESTAMP DEFAULT now(),
    UNIQUE (project_id, talent_id)
);

CREATE INDEX idx_project_members_project ON project_members(project_id);
CREATE INDEX idx_project_members_talent  ON project_members(talent_id);
CREATE INDEX idx_project_members_status  ON project_members(status);

-- =====================================================
-- 11. PROJECT SKILL REQUIREMENTS
-- =====================================================

CREATE TABLE project_skill_requirements (
    id                BIGSERIAL PRIMARY KEY,
    project_id        BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    skill_name        VARCHAR(100) NOT NULL,
    proficiency_level proficiency_level_enum NOT NULL,
    is_required       BOOLEAN DEFAULT TRUE,
    priority          INTEGER DEFAULT 0,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (project_id, skill_name)
);

-- =====================================================
-- 12. PROJECT TECHNOLOGIES
-- =====================================================

CREATE TABLE project_technologies (
    id               BIGSERIAL PRIMARY KEY,
    project_id       BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    technology_name  VARCHAR(100) NOT NULL,
    technology_type  VARCHAR(50),
    is_required      BOOLEAN DEFAULT TRUE,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (project_id, technology_name)
);

-- =====================================================
-- 13. PROJECT REJECTIONS
-- =====================================================

CREATE TABLE project_rejections (
    id               BIGSERIAL PRIMARY KEY,
    project_id       BIGINT REFERENCES projects(id) ON DELETE SET NULL,
    rejected_by      BIGINT NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    rejection_reason TEXT,
    rejected_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    title            VARCHAR(255),
    slug             VARCHAR(255),
    enterprise_name  VARCHAR(255)
);

-- =====================================================
-- 14. MENTOR INVITATIONS
-- =====================================================

CREATE TABLE mentor_invitations (
    id                    BIGSERIAL PRIMARY KEY,
    project_id            BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    mentor_id             BIGINT NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
    invited_by            BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    invitation_message    TEXT,
    compensation_amount   NUMERIC(15,2),
    expected_effort_hours INTEGER,
    status                invitation_status_enum DEFAULT 'PENDING',
    response_message      TEXT,
    responded_at          TIMESTAMP,
    availability_info     JSONB,
    expires_at            TIMESTAMP NOT NULL,
    created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_mentor_invitations_mentor  ON mentor_invitations(mentor_id);
CREATE INDEX idx_mentor_invitations_status  ON mentor_invitations(status);
CREATE INDEX idx_mentor_invitations_project ON mentor_invitations(project_id);

-- =====================================================
-- 15. MENTOR TASKS
-- =====================================================

CREATE TABLE mentor_tasks (
    id           BIGSERIAL PRIMARY KEY,
    mentor_id    BIGINT NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
    project_id   BIGINT REFERENCES projects(id) ON DELETE SET NULL,
    title        VARCHAR(255) NOT NULL,
    description  TEXT,
    status       VARCHAR(50) NOT NULL DEFAULT 'pending',
    progress     INTEGER NOT NULL DEFAULT 0,
    assigned_to  JSONB DEFAULT '[]',
    due_date     DATE,
    priority     VARCHAR(50) NOT NULL DEFAULT 'medium',
    project_name VARCHAR(255),
    created_at   TIMESTAMP NOT NULL DEFAULT now(),
    updated_at   TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_mentor_tasks_mentor  ON mentor_tasks(mentor_id);
CREATE INDEX idx_mentor_tasks_project ON mentor_tasks(project_id);

-- =====================================================
-- 16. MENTOR TASK SUBMISSIONS
-- =====================================================

CREATE TABLE mentor_task_submissions (
    id           BIGSERIAL PRIMARY KEY,
    task_id      BIGINT NOT NULL REFERENCES mentor_tasks(id) ON DELETE CASCADE,
    talent_id    BIGINT NOT NULL REFERENCES talents(id) ON DELETE CASCADE,
    file_name    VARCHAR(255) NOT NULL,
    file_path    VARCHAR(500) NOT NULL,
    file_size    BIGINT,
    submitted_at TIMESTAMP DEFAULT now()
);

-- =====================================================
-- 17. MENTOR REPORTS
-- =====================================================

CREATE TABLE mentor_reports (
    id                BIGSERIAL PRIMARY KEY,
    project_id        BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    mentor_id         BIGINT NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
    report_type       report_type_enum NOT NULL,
    reporting_period  VARCHAR(7) NOT NULL,
    project_progress  JSONB NOT NULL,
    tasks_completed   JSONB,
    tasks_upcoming    JSONB,
    team_performance  JSONB,
    achievements      JSONB,
    challenges        JSONB,
    risks             JSONB,
    next_month_goals  JSONB,
    budget_usage      JSONB,
    meetings_held     INTEGER,
    code_metrics      JSONB,
    status            report_status_enum DEFAULT 'DRAFT',
    submitted_at      TIMESTAMP,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (project_id, reporting_period)
);

-- =====================================================
-- 18. TALENT EVALUATIONS
-- =====================================================

CREATE TABLE talent_evaluations (
    id                BIGSERIAL PRIMARY KEY,
    project_id        BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    talent_id         BIGINT NOT NULL REFERENCES talents(id) ON DELETE CASCADE,
    mentor_id         BIGINT NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
    evaluation_period VARCHAR(7) NOT NULL,
    overall_score     NUMERIC(3,1),
    technical_skills  JSONB,
    problem_solving   JSONB,
    teamwork          JSONB,
    communication     JSONB,
    code_quality      JSONB,
    punctuality       JSONB,
    strengths         JSONB,
    weaknesses        JSONB,
    recommendations   JSONB,
    tasks_completed   INTEGER,
    tasks_total       INTEGER,
    hours_worked      INTEGER,
    grade             evaluation_grade_enum,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (project_id, talent_id, evaluation_period),
    CONSTRAINT check_score CHECK (overall_score >= 0 AND overall_score <= 10)
);

-- =====================================================
-- 19. ENTERPRISE FEEDBACK
-- =====================================================

CREATE TABLE enterprise_feedback (
    id                       BIGSERIAL PRIMARY KEY,
    project_id               BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    enterprise_id            BIGINT NOT NULL REFERENCES enterprises(id) ON DELETE CASCADE,
    overall_rating           NUMERIC(3,2),
    quality_rating           NUMERIC(3,2),
    communication_rating     NUMERIC(3,2),
    timeline_rating          NUMERIC(3,2),
    professionalism_rating   NUMERIC(3,2),
    positive_feedback        TEXT,
    negative_feedback        TEXT,
    suggestions              TEXT,
    would_recommend          BOOLEAN,
    would_work_again         BOOLEAN,
    status                   report_status_enum DEFAULT 'DRAFT',
    submitted_at             TIMESTAMP,
    created_at               TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_overall_rating CHECK (overall_rating >= 0 AND overall_rating <= 5)
);

-- =====================================================
-- 20. PAYMENTS
-- =====================================================

CREATE TABLE payments (
    id                    BIGSERIAL PRIMARY KEY,
    project_id            BIGINT NOT NULL REFERENCES projects(id) ON DELETE RESTRICT,
    enterprise_id         BIGINT NOT NULL REFERENCES enterprises(id) ON DELETE RESTRICT,
    payment_code          VARCHAR(50) NOT NULL UNIQUE,
    amount                NUMERIC(15,2) NOT NULL,
    currency              VARCHAR(10) DEFAULT 'VND',
    payos_order_id        VARCHAR(100) UNIQUE,
    payos_transaction_id  VARCHAR(100),
    payos_payment_link    VARCHAR(500),
    status                payment_status_enum NOT NULL DEFAULT 'PENDING',
    payment_method        VARCHAR(50),
    description           TEXT,
    note                  TEXT,
    payment_link_expires_at TIMESTAMP,
    paid_at               TIMESTAMP,
    created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_amount CHECK (amount > 0)
);

CREATE INDEX idx_payments_project    ON payments(project_id);
CREATE INDEX idx_payments_enterprise ON payments(enterprise_id);
CREATE INDEX idx_payments_status     ON payments(status);

-- =====================================================
-- 21. FUND ALLOCATIONS
-- =====================================================

CREATE TABLE fund_allocations (
    id                BIGSERIAL PRIMARY KEY,
    project_id        BIGINT NOT NULL UNIQUE REFERENCES projects(id) ON DELETE RESTRICT,
    payment_id        BIGINT NOT NULL REFERENCES payments(id) ON DELETE RESTRICT,
    total_amount      NUMERIC(15,2) NOT NULL,
    team_percentage   NUMERIC(5,2) DEFAULT 70.00,
    team_amount       NUMERIC(15,2) NOT NULL,
    mentor_percentage NUMERIC(5,2) DEFAULT 20.00,
    mentor_amount     NUMERIC(15,2) NOT NULL,
    lab_percentage    NUMERIC(5,2) DEFAULT 10.00,
    lab_amount        NUMERIC(15,2) NOT NULL,
    status            fund_allocation_status_enum DEFAULT 'ALLOCATED',
    validated_by      BIGINT REFERENCES users(id) ON DELETE SET NULL,
    validated_at      TIMESTAMP,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_percentages CHECK (team_percentage + mentor_percentage + lab_percentage = 100),
    CONSTRAINT check_amounts     CHECK (team_amount + mentor_amount + lab_amount = total_amount)
);

-- =====================================================
-- 22. FUND DISTRIBUTIONS
-- =====================================================

CREATE TABLE fund_distributions (
    id                    BIGSERIAL PRIMARY KEY,
    allocation_id         BIGINT NOT NULL REFERENCES fund_allocations(id) ON DELETE RESTRICT,
    recipient_type        recipient_type_enum NOT NULL,
    recipient_id          BIGINT,
    amount                NUMERIC(15,2) NOT NULL,
    status                fund_distribution_status_enum DEFAULT 'PENDING',
    disbursed_at          TIMESTAMP,
    disbursed_by          BIGINT REFERENCES users(id) ON DELETE SET NULL,
    payment_method        VARCHAR(50),
    transaction_reference VARCHAR(100),
    created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 23. HYBRID FUND ADVANCES
-- =====================================================

CREATE TABLE hybrid_fund_advances (
    id                      BIGSERIAL PRIMARY KEY,
    project_id              BIGINT NOT NULL REFERENCES projects(id) ON DELETE RESTRICT,
    payment_id              BIGINT NOT NULL REFERENCES payments(id) ON DELETE RESTRICT,
    advance_reason          advance_reason_enum NOT NULL,
    advance_amount          NUMERIC(15,2) NOT NULL,
    advanced_at             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expected_repayment_date DATE NOT NULL,
    repayment_status        repayment_status_enum DEFAULT 'OUTSTANDING',
    repaid_amount           NUMERIC(15,2) DEFAULT 0,
    repaid_at               TIMESTAMP,
    approved_by             BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    approval_note           TEXT
);

-- =====================================================
-- 24. TEAM FUND DISTRIBUTIONS
-- =====================================================

CREATE TABLE team_fund_distributions (
    id                    BIGSERIAL PRIMARY KEY,
    project_id            BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    allocation_id         BIGINT NOT NULL REFERENCES fund_allocations(id) ON DELETE RESTRICT,
    submitted_by          BIGINT NOT NULL,
    total_team_amount     NUMERIC(15,2) NOT NULL,
    status                team_fund_status_enum DEFAULT 'DRAFT',
    approved_by_mentor    BIGINT,
    approved_by_mentor_at TIMESTAMP,
    approved_by_lab       BIGINT,
    approved_by_lab_at    TIMESTAMP,
    rejection_reason      TEXT,
    created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 25. TEAM MEMBER ALLOCATIONS
-- =====================================================

CREATE TABLE team_member_allocations (
    id                BIGSERIAL PRIMARY KEY,
    distribution_id   BIGINT NOT NULL REFERENCES team_fund_distributions(id) ON DELETE CASCADE,
    talent_id         BIGINT NOT NULL REFERENCES talents(id) ON DELETE CASCADE,
    percentage        NUMERIC(5,2) NOT NULL,
    amount            NUMERIC(15,2) NOT NULL,
    reason            TEXT,
    tasks_completed   INTEGER,
    hours_contributed INTEGER,
    performance_score NUMERIC(3,2),
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_percentage CHECK (percentage >= 5 AND percentage <= 100)
);

-- =====================================================
-- 26. TRANSPARENCY REPORTS
-- =====================================================

CREATE TABLE transparency_reports (
    id           BIGSERIAL PRIMARY KEY,
    report_type  report_type_enum NOT NULL,
    period       VARCHAR(7) NOT NULL,
    statistics   JSONB NOT NULL,
    charts_data  JSONB,
    publish_note TEXT,
    status       report_status_enum DEFAULT 'DRAFT',
    public_url   VARCHAR(500),
    pdf_url      VARCHAR(500),
    created_by   BIGINT REFERENCES users(id) ON DELETE SET NULL,
    published_at TIMESTAMP,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- AUTO-UPDATE updated_at TRIGGER
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at               BEFORE UPDATE ON users               FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_enterprises_updated_at          BEFORE UPDATE ON enterprises          FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_mentors_updated_at              BEFORE UPDATE ON mentors              FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_talents_updated_at              BEFORE UPDATE ON talents              FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_projects_updated_at             BEFORE UPDATE ON projects             FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_project_members_updated_at      BEFORE UPDATE ON project_members      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_talent_skills_updated_at        BEFORE UPDATE ON talent_skills        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_talent_certifications_updated_at BEFORE UPDATE ON talent_certifications FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_mentor_tasks_updated_at         BEFORE UPDATE ON mentor_tasks         FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_mentor_reports_updated_at       BEFORE UPDATE ON mentor_reports       FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_payments_updated_at             BEFORE UPDATE ON payments             FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_team_fund_distributions_updated_at BEFORE UPDATE ON team_fund_distributions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
