# LabOdc - Hệ thống quản lý kết nối doanh nghiệp với sinh viên UTH

**LabOdc** - A System for Managing Enterprise-Student Collaborations at UTH on Real-World Projects

## 📋 Tổng quan dự án

LabOdc là hệ thống Lab-based ODC (Offshore Development Center) phi lợi nhuận được thiết kế đặc biệt cho Đại học Giao thông Vận tải TP.HCM (UTH), cho phép doanh nghiệp và sinh viên hợp tác trong các dự án thực tế với tính minh bạch và trách nhiệm giải trình.

## 🎯 Mục tiêu

- Kết nối doanh nghiệp với sinh viên UTH
- Cung cấp nền tảng hợp tác minh bạch
- Quản lý dự án với cơ chế phân phối quỹ 70/20/10
- Theo dõi tiến độ và đánh giá hiệu suất

## 🏗️ Cấu trúc dự án

```
nhom6/
├── labodc-backend/          # Backend API (Spring Boot)
├── labodc-web-portal/       # Web Portal (ReactJS + TypeScript)
├── labodc-mobile/           # Mobile App (Flutter)
├── docs/                    # Tài liệu dự án
│   ├── URD/                # User Requirements Document
│   ├── SRS/                # Software Requirements Specification
│   ├── SAD/                # Software Architecture Document
│   ├── DDD/                # Detailed Design Document
│   ├── implementation/     # Implementation Documentation
│   ├── testing/            # Test Documentation
│   ├── installation/       # Installation Guide
│   ├── source-code/        # Source Code Documentation
│   ├── deployment-package/ # Deployment Package Documentation
│   └── uml-diagrams/       # UML 2.0 Diagrams
└── deployment/             # Deployment configurations
    ├── docker/            # Docker configurations
    ├── kubernetes/        # Kubernetes manifests
    ├── aws/              # AWS deployment scripts
    ├── scripts/          # Deployment scripts
    └── nginx/            # Nginx configurations
```

## 🔧 Tech Stack

### Backend
- **Framework**: Spring Boot
- **Database**: PostgreSQL, Redis, Elasticsearch
- **Authentication**: JWT (JSON Web Tokens)

### Frontend Web
- **Framework**: ReactJS
- **Language**: TypeScript
- **State Management**: Redux/Context API

### Mobile App
- **Framework**: Flutter
- **Platform**: iOS, Android

### Third-party Services
- **Payment**: PayOS
- **Storage**: Cloudinary

### Deployment
- **Containerization**: Docker
- **Cloud Platform**: AWS

## 👥 Actors

1. **System Administrator**: Quản lý cấu hình hệ thống, roles, permissions
2. **Company (Enterprise)**: Đăng ký, đề xuất dự án, thanh toán
3. **Talent (Candidate)**: Đăng ký, tham gia dự án, nhận feedback
4. **Talent Leader**: Phân phối quỹ, báo cáo tiến độ
5. **Mentor**: Hướng dẫn, đánh giá, báo cáo
6. **Lab Administrator**: Xác thực dự án, quản lý, phân bổ quỹ

## 📊 Cơ chế phân phối quỹ

- **70%**: Team (Sinh viên)
- **20%**: Mentor
- **10%**: Lab

## 🚀 Getting Started

### Prerequisites
- JDK 17+
- Node.js 18+
- Flutter SDK 3.0+
- Docker
- PostgreSQL 14+

### Installation

Chi tiết hướng dẫn cài đặt sẽ được cập nhật trong thư mục `docs/installation/`

## 📖 Tài liệu

Tất cả tài liệu dự án được lưu trữ trong thư mục `docs/`:

- **URD**: User Requirements Document
- **SRS**: Software Requirements Specification  
- **SAD**: Software Architecture Document
- **DDD**: Detailed Design Document
- **UML Diagrams**: Use Case, Class, Sequence, Activity diagrams (UML 2.0)

## 🤝 Contributing

Vui lòng đọc [CONTRIBUTING.md](CONTRIBUTING.md) để biết chi tiết về quy trình đóng góp.

## 📝 License

[Thêm thông tin license nếu có]

## 📧 Contact

- **Project Team**: Nhóm 6
- **University**: UTH - Đại học Giao thông Vận tải TP.HCM
