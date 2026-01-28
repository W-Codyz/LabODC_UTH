## Phase 2 – Project Service (Core Business Flow)

Ngày thực hiện: 2026-01-28

Tham chiếu spec: [phase2.md](phase2.md)

Base URL qua Gateway (local): `http://localhost:8085` (do port 8080 bị chiếm ở máy dev)

---

### Bước 1 – Tạo `project-service`

Đã tạo service mới tại [labodc/project-service](labodc/project-service):

- Maven + Spring Boot 3.2.2 (Java 17)
- Dependencies: Web, Security, Validation, JPA, PostgreSQL, JJWT
- Expose port: `8083`
- Dockerfile multi-stage giống các service Phase 1

Đã thêm vào aggregator Maven để VS Code/Java tooling nhận project multi-module:

- [labodc/pom.xml](labodc/pom.xml)

### Bước 2 – Database & Entity

Đã tạo 2 entity theo spec:

- `Project`: id, name, description, enterpriseId, mentorId, status (DRAFT|PENDING|APPROVED|REJECTED), createdAt
- `ProjectMember`: id, projectId, userId, role (ENTERPRISE|TALENT|MENTOR|LEADER)

Lưu ý:

- `enterpriseId` lấy từ JWT `sub` (subject) của user hiện tại.
- `mentorId` tạm là optional trong `CreateProjectRequest`.
- `createdAt` set bằng `@PrePersist`.

### Bước 3 – Security & JWT

Đã thêm JWT filter cho Project Service:

- Validate Bearer token
- Parse `sub` → `userId` (long)
- Lấy `email` + `role` từ claims
- Set `SecurityContext` với authority = role (giống [labodc/user-service](labodc/user-service))

### Bước 4 – API (MVP) + phân quyền

Đã implement các API bắt buộc:

- `POST /projects` (ENTERPRISE) → tạo project status=PENDING
- `GET /projects/my` (ALL AUTH) → list dự án owned + joined
- `PUT /projects/{id}/approve` (LAB_ADMIN)
- `PUT /projects/{id}/reject` (LAB_ADMIN)
- `POST /projects/{id}/join` (TALENT)
- `GET /projects/{id}` (ALL AUTH) → yêu cầu là owner/member hoặc LAB_ADMIN

Rule nghiệp vụ bổ sung (để tránh trạng thái sai):

- Chỉ `PENDING` mới approve/reject
- Chỉ `APPROVED` mới join

### Bước 5 – API Gateway update

Đã thêm route `/projects/**` → `http://project-service:8083` tại:

- [labodc/api-gateway/src/main/resources/application.yml](labodc/api-gateway/src/main/resources/application.yml)

### Bước 6 – Docker compose update

Đã thêm container `project-service` (port 8083) vào:

- [labodc/docker-compose.yml](labodc/docker-compose.yml)

Environment dùng chung với Phase 1:

- `SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/labodc`
- `SECURITY_JWT_SECRET=...` (phải giống gateway/auth/user)

### Bước 7 – Smoke test (qua Gateway)

Đã tạo script test:

- [labodc/test-phase2.ps1](labodc/test-phase2.ps1)

Flow test theo spec:

1. Register/Login ENTERPRISE
2. `POST /projects`
3. Register/Login LAB_ADMIN
4. `PUT /projects/{id}/approve`
5. Register/Login TALENT
6. `POST /projects/{id}/join`
7. `GET /projects/my`

Chạy:

- `cd labodc`
- `docker compose up --build`
- (terminal khác) `./test-phase2.ps1`

Kết quả kiểm thử thực tế:

- Lần 1: FAIL `POST /projects` trả 404 do Gateway route `Path=/projects/**` không match endpoint gốc `/projects`.
- Fix: đổi predicate thành `Path=/projects,/projects/**` tại [labodc/api-gateway/src/main/resources/application.yml](labodc/api-gateway/src/main/resources/application.yml).
- Rebuild gateway: `docker compose up -d --build api-gateway`
- Lần 2: PASS toàn bộ (201/200 đúng kỳ vọng).

Kiểm thử bổ sung (RBAC / negative-case):

- Script: [labodc/test-phase2-rbac.ps1](labodc/test-phase2-rbac.ps1)
- Case cover:
  - ENTERPRISE approve → 403
  - TALENT approve → 403
  - TALENT join khi project chưa APPROVED → 400
  - TALENT xem project khi chưa là member → 403
  - LAB_ADMIN approve → 200
  - TALENT join sau approve → 200
  - TALENT xem project sau khi join → 200

Kết quả chạy thực tế: PASS toàn bộ (đúng status code kỳ vọng).

---

Trạng thái hiện tại:

- Đã hoàn thành Bước 1 → Bước 7 trong spec Phase 2 ở mức MVP.
