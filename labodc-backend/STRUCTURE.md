# Cấu trúc chi tiết thư mục Backend

## Controller Layer

### admin/
- `LabAdminController.java` - Quản lý Lab Admin functions
- `EnterpriseManagementController.java` - Quản lý doanh nghiệp
- `ProjectValidationController.java` - Xác thực dự án
- `FundAllocationController.java` - Phân bổ quỹ
- `ReportController.java` - Báo cáo minh bạch

### enterprise/
- `EnterpriseController.java` - Dashboard & profile
- `ProjectProposalController.java` - Đề xuất dự án
- `PaymentController.java` - Thanh toán
- `ProjectRequestController.java` - Yêu cầu thay đổi/hủy

### mentor/
- `MentorController.java` - Dashboard & profile
- `TaskManagementController.java` - Quản lý task
- `TalentEvaluationController.java` - Đánh giá talent
- `ReportSubmissionController.java` - Nộp báo cáo

### talent/
- `TalentController.java` - Dashboard & profile
- `ProjectParticipationController.java` - Tham gia dự án
- `TaskViewController.java` - Xem task
- `PerformanceController.java` - Xem đánh giá

## Model Layer

### entity/
- `User.java` - Base user entity
- `Enterprise.java` - Doanh nghiệp
- `Talent.java` - Sinh viên
- `Mentor.java` - Mentor
- `Project.java` - Dự án
- `ProjectProposal.java` - Đề xuất dự án
- `Payment.java` - Thanh toán
- `FundDistribution.java` - Phân phối quỹ
- `Task.java` - Nhiệm vụ
- `Report.java` - Báo cáo
- `Evaluation.java` - Đánh giá

### enums/
- `UserRole.java` - SYSTEM_ADMIN, LAB_ADMIN, ENTERPRISE, TALENT, MENTOR
- `ProjectStatus.java` - PROPOSED, APPROVED, IN_PROGRESS, COMPLETED, CANCELLED
- `PaymentStatus.java` - PENDING, PAID, DELAYED, REFUNDED
- `TaskStatus.java` - TODO, IN_PROGRESS, COMPLETED

## Service Layer

### impl/
- `AuthServiceImpl.java`
- `ProjectServiceImpl.java`
- `PaymentServiceImpl.java`
- `FundServiceImpl.java`
- `ReportServiceImpl.java`
- `StorageServiceImpl.java`
- `NotificationServiceImpl.java`
