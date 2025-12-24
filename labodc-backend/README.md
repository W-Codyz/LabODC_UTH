# LabOdc Backend - Spring Boot

## 📁 Cấu trúc thư mục

```
labodc-backend/
├── src/
│   ├── main/
│   │   ├── java/com/uth/labodc/
│   │   │   ├── config/              # Configuration classes
│   │   │   ├── controller/          # REST Controllers
│   │   │   │   ├── admin/          # Lab Admin controllers
│   │   │   │   ├── enterprise/     # Enterprise controllers
│   │   │   │   ├── mentor/         # Mentor controllers
│   │   │   │   └── talent/         # Talent controllers
│   │   │   ├── dto/                # Data Transfer Objects
│   │   │   ├── exception/          # Custom exceptions
│   │   │   ├── model/              # Domain models
│   │   │   │   ├── entity/        # JPA entities
│   │   │   │   └── enums/         # Enumerations
│   │   │   ├── repository/         # Data repositories
│   │   │   ├── security/           # Security configs & JWT
│   │   │   ├── service/            # Business logic
│   │   │   │   └── impl/          # Service implementations
│   │   │   └── util/               # Utility classes
│   │   └── resources/
│   │       ├── application.yml     # Application configuration
│   │       ├── db/migration/       # Flyway migrations
│   │       └── templates/          # Excel templates
│   └── test/                       # Unit & Integration tests
├── pom.xml                         # Maven dependencies
└── Dockerfile                      # Docker configuration
```

## 🔑 Các module chính

### Controllers
- **Admin**: Quản lý dự án, doanh nghiệp, mentor, talents
- **Enterprise**: Đăng ký, đề xuất dự án, thanh toán
- **Mentor**: Quản lý task, đánh giá, báo cáo
- **Talent**: Tham gia dự án, xem task, nhận feedback

### Services
- **AuthService**: Xác thực & phân quyền
- **ProjectService**: Quản lý dự án
- **PaymentService**: Xử lý thanh toán (PayOS)
- **FundService**: Phân phối quỹ 70/20/10
- **ReportService**: Báo cáo tiến độ
- **StorageService**: Lưu trữ file (Cloudinary)

## 🗄️ Database

- **PostgreSQL**: Primary database
- **Redis**: Cache & session
- **Elasticsearch**: Full-text search

## 🚀 Getting Started

### Prerequisites
- JDK 17 or higher
- Maven 3.8+
- PostgreSQL 14+
- Redis

### Installation

```bash
# Clone repository
cd labodc-backend

# Install dependencies
mvn clean install

# Run application
mvn spring-boot:run
```

### Environment Variables

Create `application-local.yml` or set environment variables:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/labodc
    username: your_username
    password: your_password
  
  redis:
    host: localhost
    port: 6379

jwt:
  secret: your_jwt_secret
  expiration: 86400000

payos:
  api-key: your_payos_key
  api-secret: your_payos_secret

cloudinary:
  cloud-name: your_cloud_name
  api-key: your_cloudinary_key
  api-secret: your_cloudinary_secret
```

## 📝 API Documentation

API documentation sẽ có tại: `http://localhost:8080/swagger-ui.html`

## 🧪 Testing

```bash
# Run all tests
mvn test

# Run specific test
mvn test -Dtest=YourTestClass
```
