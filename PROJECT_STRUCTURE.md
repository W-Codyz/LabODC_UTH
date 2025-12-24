# Tổng quan cấu trúc dự án

```
LabODC_UTH/
│
├── labodc-backend/                 # Spring Boot Backend API
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/uth/labodc/
│   │   │   │   ├── config/              # Cấu hình Spring
│   │   │   │   ├── controller/
│   │   │   │   │   ├── admin/          # APIs Lab Admin
│   │   │   │   │   ├── enterprise/     # APIs doanh nghiệp
│   │   │   │   │   ├── mentor/         # APIs mentor
│   │   │   │   │   └── talent/         # APIs người tài năng
│   │   │   │   ├── dto/                # Data Transfer Objects
│   │   │   │   ├── exception/          # Exceptions tùy chỉnh
│   │   │   │   ├── model/
│   │   │   │   │   ├── entity/        # JPA entities
│   │   │   │   │   └── enums/         # Enumerations
│   │   │   │   ├── repository/         # Spring Data repositories
│   │   │   │   ├── security/           # JWT, cấu hình Auth
│   │   │   │   ├── service/
│   │   │   │   │   └── impl/          # Triển khai services
│   │   │   │   └── util/               # Các lớp tiện ích
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       ├── db/migration/       # Flyway scripts
│   │   │       └── templates/          # Excel templates
│   │   └── test/                       # Unit và Integration tests
│   ├── pom.xml
│   ├── Dockerfile
│   ├── README.md
│   └── STRUCTURE.md
│
├── labodc-web-portal/             # ReactJS + TypeScript Frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/                     # Hình ảnh, fonts, icons
│   │   ├── components/
│   │   │   ├── common/                # Components tái sử dụng
│   │   │   ├── forms/                 # Form components
│   │   │   └── layout/                # Header, Footer, Sidebar
│   │   ├── hooks/                      # Custom React hooks
│   │   ├── pages/
│   │   │   ├── admin/                 # Trang Lab Admin
│   │   │   ├── auth/                  # Đăng nhập, Đăng ký
│   │   │   ├── enterprise/            # Dashboard doanh nghiệp
│   │   │   ├── mentor/                # Dashboard mentor
│   │   │   ├── system-admin/          # Trang System Admin
│   │   │   └── talent/                # Cổng người tài năng
│   │   ├── services/                   # Dịch vụ API
│   │   ├── store/                      # Redux/Context state
│   │   ├── styles/                     # Styles toàn cục
│   │   ├── types/                      # TypeScript types
│   │   ├── utils/                      # Hàm tiện ích
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── README.md
│
├── labodc-mobile/                 # Flutter Mobile App
│   ├── android/                        # Dự án Android
│   ├── ios/                            # Dự án iOS
│   ├── lib/
│   │   ├── core/
│   │   │   ├── constants/
│   │   │   ├── network/
│   │   │   ├── routes/
│   │   │   └── theme/
│   │   ├── models/                     # Data models
│   │   ├── providers/                  # Quản lý state
│   │   ├── screens/
│   │   │   ├── auth/
│   │   │   ├── enterprise/
│   │   │   ├── mentor/
│   │   │   └── talent/
│   │   ├── services/                   # Dịch vụ API
│   │   ├── utils/                      # Tiện ích
│   │   ├── widgets/                    # Widgets tái sử dụng
│   │   └── main.dart
│   ├── assets/
│   │   ├── fonts/
│   │   └── images/
│   ├── test/
│   ├── pubspec.yaml
│   └── README.md
│
├── docs/                          # Tài liệu dự án
│   ├── URD/                            # User Requirements Document
│   ├── SRS/                            # Software Requirements Specification
│   ├── SAD/                            # Software Architecture Document
│   ├── DDD/                            # Detailed Design Document
│   ├── implementation/                 # Tài liệu triển khai
│   ├── testing/                        # Tài liệu kiểm thử
│   ├── installation/                   # Hướng dẫn cài đặt
│   ├── source-code/                    # Tài liệu code
│   ├── deployment-package/             # Tài liệu gói triển khai
│   ├── uml-diagrams/                   # Sơ đồ UML 2.0
│   └── README.md
│
├── deployment/                    # Deployment Configurations
│   ├── docker/
│   │   ├── backend/
│   │   ├── frontend/
│   │   └── docker-compose.yml
│   ├── kubernetes/
│   │   ├── backend/
│   │   ├── frontend/
│   │   ├── database/
│   │   └── ingress/
│   ├── aws/
│   │   ├── terraform/
│   │   ├── cloudformation/
│   │   └── scripts/
│   ├── nginx/
│   │   ├── nginx.conf
│   │   └── sites/
│   ├── scripts/
│   │   ├── deploy.sh
│   │   ├── rollback.sh
│   │   └── health-check.sh
│   └── README.md
│
├── .gitignore
└── README.md
```

## 📊 Tổng kết ngăn xếp công nghệ

### Backend
- **Framework**: Spring Boot 3.x
- **Ngôn ngữ**: Java 17
- **Database**: PostgreSQL 14+
- **Cache**: Redis
- **Tìm kiếm**: Elasticsearch
- **Build**: Maven

### Frontend Web
- **Framework**: ReactJS 18
- **Ngôn ngữ**: TypeScript
- **State**: Redux Toolkit
- **UI**: Ant Design / Material-UI
- **Build**: Vite / Webpack

### Mobile
- **Framework**: Flutter 3.x
- **Ngôn ngữ**: Dart 3.x
- **State**: Provider / Riverpod
- **Nền tảng**: iOS và Android

### DevOps
- **Container**: Docker
- **Điều phối**: Kubernetes
- **Đám mây**: AWS (EC2, RDS, S3, CloudFront)
- **CI/CD**: GitLab CI / GitHub Actions
- **Giám sát**: CloudWatch, ELK Stack

### Bên thứ ba
- **Thanh toán**: PayOS
- **Lưu trữ**: Cloudinary
- **Xác thực**: JWT

## 🎯 Tính năng chính theo module

### Module doanh nghiệp
✅ Đăng ký và quản lý hồ sơ
✅ Nộp đề xuất dự án
✅ Thanh toán (PayOS)
✅ Xem báo cáo và đánh giá
✅ Yêu cầu thay đổi/hủy

### Module người tài năng
✅ Quản lý hồ sơ và kỹ năng
✅ Duyệt và tham gia dự án
✅ Xem nhiệm vụ được giao
✅ Nhận phản hồi từ mentor
✅ Theo dõi hiệu suất

### Module Mentor
✅ Chấp nhận lời mời dự án
✅ Phân tích nhiệm vụ (Excel templates)
✅ Đánh giá người tài năng
✅ Nộp báo cáo
✅ Xác nhận phân phối lại quỹ

### Module Lab Admin
✅ Xác thực doanh nghiệp và dự án
✅ Quản lý mentors và người tài năng
✅ Phân bổ quỹ (70/20/10)
✅ Công bố báo cáo minh bạch
✅ Phê duyệt/từ chối thay đổi

### Module System Admin
✅ Cấu hình hệ thống
✅ Quản lý vai trò và quyền
✅ Quản lý người dùng
✅ Bảo trì template
