abOdc – Phase 2: Project Service (Core Business Flow)

Trạng thái hiện tại:
✅ Phase 1 hoàn thành (Gateway + Auth + User + JWT + Docker)

Mục tiêu Phase 2:

Có Project Service (microservice mới)

Thực hiện được luồng nghiệp vụ cốt lõi đầu tiên

Tất cả request đi qua API Gateway

🧭 PHẠM VI PHASE 2 (RẤT QUAN TRỌNG)
✅ Phase 2 CHỈ làm:

Project

Project approval

Join project

Phân vai trò trong project

❌ Phase 2 CHƯA làm:

Task chi tiết

Payment

Fund 70/20/10

Report

🧱 KIẾN TRÚC SAU PHASE 2
[ Web / Mobile ]
│
▼
API Gateway
│
┌──────┼──────────┐
▼ ▼ ▼
Auth User Project
Svc Svc Service

🟦 BƯỚC 1 – TẠO PROJECT SERVICE
1.1 Tạo service mới
cd labodc
spring init project-service \
 --dependencies=web,security,jpa,postgresql \
 --build=maven

1.2 Thêm vào aggregator pom.xml
<module>project-service</module>

🟩 BƯỚC 2 – DATABASE & ENTITY
2.1 Entity: Project
Project

- id
- name
- description
- enterpriseId
- mentorId
- status (DRAFT | PENDING | APPROVED | REJECTED)
- createdAt

  2.2 Entity: ProjectMember
  ProjectMember

- id
- projectId
- userId
- role (ENTERPRISE | TALENT | MENTOR | LEADER)

📌 Note cho AI:

enterpriseId, mentorId, userId là ID lấy từ JWT (Phase 1)

🟨 BƯỚC 3 – SECURITY & JWT
3.1 JWT Filter

- Validate Bearer token
- Lấy userId + role từ JWT
- Set vào SecurityContext

📌 Có thể copy lại logic từ user-service.

🟧 BƯỚC 4 – API CHO PROJECT SERVICE
4.1 API BẮT BUỘC (MVP)
POST /projects
→ Enterprise tạo project (status = PENDING)

GET /projects/my
→ Lấy project của user hiện tại

PUT /projects/{id}/approve
→ Lab Admin duyệt project

PUT /projects/{id}/reject
→ Lab Admin từ chối project

POST /projects/{id}/join
→ Talent join project

GET /projects/{id}
→ Xem chi tiết project

🧠 PHÂN QUYỀN (BẮT BUỘC)
API Role
POST /projects ENTERPRISE
PUT /approve LAB_ADMIN
POST /join TALENT
GET /my ALL AUTH

📌 Nếu sai role → trả 403

🟥 BƯỚC 5 – API GATEWAY UPDATE
5.1 Thêm route

- id: project-service
  uri: http://project-service:8083
  predicates:
  - Path=/projects/\*\*

🐳 BƯỚC 6 – DOCKER COMPOSE UPDATE
6.1 Thêm service
project-service:
build: ./project-service
ports: - "8083:8083"
depends_on: - postgres

6.2 Chạy lại toàn bộ
docker compose up --build

🧪 BƯỚC 7 – SMOKE TEST (RẤT QUAN TRỌNG)
Test flow tối thiểu

1. Login ENTERPRISE
2. POST /projects
3. Login LAB_ADMIN
4. PUT /projects/{id}/approve
5. Login TALENT
6. POST /projects/{id}/join
7. GET /projects/my

📌 BẮT BUỘC:

Tất cả request đi qua Gateway

✅ ĐIỀU KIỆN HOÀN THÀNH PHASE 2

Có project-service chạy độc lập

Project CRUD cơ bản

Duyệt project

Talent join project

Phân quyền đúng

Gateway route OK

Docker compose chạy được

📝 GHI CHÚ CHO BÁO CÁO

Phase 2 focuses on implementing the core business service (Project Service) using a microservices approach, enabling enterprises to submit projects, administrators to approve them, and talents to participate via a centralized API Gateway.
