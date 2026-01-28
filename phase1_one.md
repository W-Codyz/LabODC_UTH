# Phase 1 — Nhật ký thực hiện (API Gateway → Auth Service → User Service)

Ngày cập nhật: **2026-01-27**

Tài liệu nguồn: [phase1.md](phase1.md)

---

## 0) Mục tiêu Phase 1 (theo phase1.md)

- Có **API Gateway** (Spring Cloud Gateway)
- Có **Auth Service** và **User Service**
- Frontend gọi API qua Gateway
- JWT + Role hoạt động
- Chạy được bằng Docker Compose

---

## 1) BƯỚC 1 — TẠO API GATEWAY (đã làm)

### 1.1 Tạo cấu trúc thư mục

- Tạo thư mục: `labodc/api-gateway/`

### 1.2 Tạo project Gateway (Maven)

Các file đã tạo:

- `labodc/api-gateway/pom.xml`
- `labodc/api-gateway/src/main/java/com/uth/labodc/gateway/ApiGatewayApplication.java`
- `labodc/api-gateway/src/main/resources/application.yml`
- `labodc/api-gateway/Dockerfile`

Dependency chính:

- `spring-cloud-starter-gateway`
- `spring-boot-starter-security`
- `jjwt` (parse/validate JWT ở gateway)

### 1.3 Cấu hình route (application.yml)

- Gateway listen port **8080**
- Route:
  - `/auth/**` → `http://auth-service:8081`
  - `/users/**` → `http://user-service:8082`

### 1.4 JWT Filter cho Gateway (đã làm)

Mục tiêu theo phase1.md:

- Cho phép public: `/auth/login`, `/auth/register` (và mình cho thêm `/auth/validate` để tiện validate token)
- Các route khác: bắt buộc có Bearer token

Implementation:

- `labodc/api-gateway/src/main/java/com/uth/labodc/gateway/security/GatewayAuthFilter.java`
  - Check path allowlist
  - Nếu không public → yêu cầu `Authorization: Bearer <token>`
  - Parse + validate JWT bằng secret chung

Ghi chú:

- Gateway hiện **validate chữ ký + hạn token**; còn phân quyền chi tiết sẽ để service downstream tự enforce.

---

## 2) BƯỚC 2 — AUTH SERVICE (đã làm)

### 2.1 Tạo cấu trúc thư mục

- Tạo thư mục: `labodc/auth-service/`

### 2.2 Entity: UserCredential (đã làm)

- `labodc/auth-service/src/main/java/com/uth/labodc/auth/model/UserCredential.java`
  - `id (Long)`
  - `email` (unique)
  - `password` (BCrypt)
  - `role`

### 2.3 API bắt buộc (đã làm)

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/validate`

File chính:

- `labodc/auth-service/src/main/java/com/uth/labodc/auth/controller/AuthController.java`

### 2.4 JWT generation + BCrypt (đã làm)

- BCrypt: `labodc/auth-service/src/main/java/com/uth/labodc/auth/config/SecurityConfig.java`
- JWT generate/validate:
  - `labodc/auth-service/src/main/java/com/uth/labodc/auth/service/JwtService.java`
  - Token HS256, chứa claims: `email`, `role`, và `sub = userId`

Ghi chú quan trọng:

- Secret JWT cần **giống nhau** giữa `api-gateway`, `auth-service`, `user-service`.

---

## 3) BƯỚC 3 — USER SERVICE (đã làm để hoàn chỉnh Phase 1)

### 3.1 Entity: UserProfile

- `labodc/user-service/src/main/java/com/uth/labodc/user/model/UserProfile.java`

### 3.2 Validate JWT từ Gateway

- `labodc/user-service/src/main/java/com/uth/labodc/user/security/JwtAuthenticationFilter.java`
  - Validate Bearer token
  - Set principal `AuthenticatedUser(userId,email,role)` vào SecurityContext

### 3.3 API bắt buộc

- `GET /users/me` (tự tạo profile nếu chưa tồn tại)
- `PUT /users/me`
- `GET /users/by-role/{role}` (bị chặn role; chỉ `ADMIN|SYSTEM_ADMIN|LAB_ADMIN`)

---

## 4) BƯỚC 4 — DOCKER COMPOSE (đã làm)

File đã tạo:

- `labodc/docker-compose.yml`

Service:

- `postgres:15` (5432)
- `auth-service` (8081)
- `user-service` (8082)
- `api-gateway` (8080)

---

## 5) Cách chạy nhanh (đề xuất)

Tại thư mục `labodc/`:

- `docker-compose up --build`

Test nhanh qua Gateway:

- Register: `POST http://localhost:8080/auth/register`
- Login: `POST http://localhost:8080/auth/login` → lấy `token`
- Me: `GET http://localhost:8080/users/me` với header `Authorization: Bearer <token>`

---

## 6) Trạng thái hiện tại

- ✅ API Gateway: route + JWT filter
- ✅ Auth Service: register/login/validate + BCrypt + JWT
- ✅ User Service: validate JWT + users APIs
- ✅ Docker Compose: chạy 4 services

## 7) Việc cần làm tiếp (nếu bước chạy gặp lỗi)

- Đổi `SECURITY_JWT_SECRET` trong `labodc/docker-compose.yml` thành secret dài >= 32 ký tự và không công khai.
- Nếu Postgres trùng port 5432 với hệ khác: đổi sang `"5433:5432"`.
- Bổ sung script test (curl/PowerShell) để demo báo cáo.

### Trạng thái verify trên máy hiện tại

- Mình **chưa chạy được `docker compose build/up` trong terminal** vì Docker Engine chưa mở (CLI báo không tìm thấy pipe `dockerDesktopLinuxEngine`).
- Khi Docker Desktop/Engine chạy, bạn có thể chạy lại: `cd labodc` → `docker compose up --build`.

---

## 8) Kết quả test/kiểm thử (đã chạy thực tế)

### 8.1 Trạng thái containers

- Postgres: OK (healthy)
- Auth Service: OK
- User Service: OK
- API Gateway: OK

Ghi chú:

- Máy đang **bị chiếm port 8080**, nên mình publish Gateway ra **8085** (compose map `8085:8080`). Vì vậy base URL test là `http://localhost:8085`.

### 8.2 Smoke test end-to-end (Gateway → Auth → User)

Mình tạo script test để bạn chạy lại bất kỳ lúc nào:

- `labodc/test-phase1.ps1`

Lệnh chạy:

- `powershell -NoProfile -ExecutionPolicy Bypass -File labodc/test-phase1.ps1`

Các case đã test và kết quả:

- ✅ `GET /actuator/health` (gateway) → **200**
- ✅ `GET /users/me` không token → **401**
- ✅ `POST /auth/register` (role ADMIN) → **200**
- ✅ `POST /auth/login` (ADMIN) → **200** và trả `token`
- ✅ `GET /users/me` (ADMIN token) → **200**
- ✅ `PUT /users/me` (ADMIN token) → **200**
- ✅ `GET /users/by-role/ADMIN` (ADMIN token) → **200**
- ✅ `POST /auth/register` (role TALENT) → **200**
- ✅ `POST /auth/login` (TALENT) → **200**
- ✅ `GET /users/by-role/ADMIN` (TALENT token) → **403** (đúng kỳ vọng phân quyền)

Kết luận:

- Luồng Phase 1 **đã hoạt động end-to-end** qua Gateway (auth + jwt + users API + phân quyền).

---

## 9) Vì sao file Java bị “đỏ” trong VS Code? (không phải xung đột code)

- Nếu VS Code chưa **import Maven project**, các file trong `auth-service/` và `user-service/` sẽ bị báo _non-project file_ và hiện lỗi kiểu “package không khớp expected main.java…”.
- Đây là lỗi do **IDE chưa nhận source root**, không phải do code mới xung đột code cũ.

Đã xử lý để VS Code dễ nhận dự án hơn:

- Thêm aggregator Maven: `labodc/pom.xml` (packaging=pom) liệt kê modules.

Cách fix trên VS Code (nếu vẫn đỏ):

1. Cài `Extension Pack for Java` (nếu chưa có)
2. `Ctrl+Shift+P` → **Java: Import Java Projects** (hoặc Maven: Update Project)
3. Nếu vẫn lỗi: `Ctrl+Shift+P` → **Java: Clean Java Language Server Workspace** rồi import lại.
