LabOdc – Phase 1: Microservices + API Gateway (System Foundation)

Mục tiêu Phase 1:

Có API Gateway

Có Auth Service và User Service

Frontend gọi API qua Gateway

JWT + Role hoạt động

Chạy được bằng Docker Compose

🧭 KIẾN TRÚC TỔNG QUAN (PHASE 1)
[ React Web ] [ Flutter Mobile ]
│
▼
┌──────────────────┐
│ API GATEWAY │ (Spring Cloud Gateway)
└──────────────────┘
│
┌────┴────┐
▼ ▼
Auth Service User Service

📁 CẤU TRÚC THƯ MỤC CẦN TẠO
labodc/
├── api-gateway/
├── auth-service/
├── user-service/
└── docker-compose.yml

🟦 BƯỚC 1 – TẠO API GATEWAY
1.1 Tạo project Spring Cloud Gateway
cd labodc
spring init api-gateway \
 --dependencies=cloud-gateway,security \
 --build=maven

1.2 Thêm dependency (pom.xml)
<dependency>
<groupId>org.springframework.cloud</groupId>
<artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>

1.3 Cấu hình route (application.yml)
server:
port: 8080

spring:
cloud:
gateway:
routes: - id: auth-service
uri: http://auth-service:8081
predicates: - Path=/auth/** - id: user-service
uri: http://user-service:8082
predicates: - Path=/users/**

1.4 Việc AI cần làm

AI:

Tạo JWT Filter cho Gateway

Cho phép public /auth/login, /auth/register

Các route khác bắt buộc có token

🟩 BƯỚC 2 – AUTH SERVICE
2.1 Tạo Auth Service
spring init auth-service \
 --dependencies=web,security,jpa,postgresql \
 --build=maven

2.2 Entity
UserCredential

- id
- email
- password
- role

  2.3 API bắt buộc
  POST /auth/register
  POST /auth/login
  GET /auth/validate

  2.4 Việc AI cần làm

AI:

Implement JWT generation

Encode password (BCrypt)

Trả JWT chứa role

🟨 BƯỚC 3 – USER SERVICE
3.1 Tạo User Service
spring init user-service \
 --dependencies=web,security,jpa,postgresql \
 --build=maven

3.2 Entity
UserProfile

- id
- fullName
- email
- role
- skills
- portfolioUrl

  3.3 API bắt buộc
  GET /users/me
  PUT /users/me
  GET /users/by-role/{role}

  3.4 Việc AI cần làm

AI:

Validate JWT từ Gateway

Trả profile theo userId trong token

Chặn user không đúng role

🐳 BƯỚC 4 – DOCKER COMPOSE (BẮT BUỘC)
4.1 File docker-compose.yml
version: "3.8"

services:
api-gateway:
build: ./api-gateway
ports: - "8080:8080"
depends_on: - auth-service - user-service

auth-service:
build: ./auth-service
ports: - "8081:8081"

user-service:
build: ./user-service
ports: - "8082:8082"

postgres:
image: postgres:15
environment:
POSTGRES_USER: labodc
POSTGRES_PASSWORD: labodc
POSTGRES_DB: labodc

4.2 Chạy hệ thống
docker-compose up --build

🌐 BƯỚC 5 – FRONTEND (TỐI THIỂU)
Web (React)
axios.post("http://localhost:8080/auth/login")
axios.get("http://localhost:8080/users/me")

Mobile (Flutter)
http.post(Uri.parse("http://10.0.2.2:8080/auth/login"));

✅ ĐIỀU KIỆN HOÀN THÀNH PHASE 1

Gọi API chỉ qua Gateway

Login trả JWT

JWT có role

/users/me hoạt động

Docker Compose chạy được

📝 GHI CHÚ CHO BÁO CÁO

Phase 1 tập trung xây dựng nền tảng kiến trúc Microservices với API Gateway, đảm bảo bảo mật, phân quyền và khả năng mở rộng cho các phase tiếp theo.
