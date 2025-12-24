# Project Structure Overview

```
nhom6/
│
├── labodc-backend/                 # Spring Boot Backend API
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/uth/labodc/
│   │   │   │   ├── config/              # Spring configurations
│   │   │   │   ├── controller/
│   │   │   │   │   ├── admin/          # Lab Admin APIs
│   │   │   │   │   ├── enterprise/     # Enterprise APIs
│   │   │   │   │   ├── mentor/         # Mentor APIs
│   │   │   │   │   └── talent/         # Talent APIs
│   │   │   │   ├── dto/                # Data Transfer Objects
│   │   │   │   ├── exception/          # Custom exceptions
│   │   │   │   ├── model/
│   │   │   │   │   ├── entity/        # JPA entities
│   │   │   │   │   └── enums/         # Enumerations
│   │   │   │   ├── repository/         # Spring Data repositories
│   │   │   │   ├── security/           # JWT, Auth configs
│   │   │   │   ├── service/
│   │   │   │   │   └── impl/          # Service implementations
│   │   │   │   └── util/               # Utility classes
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       ├── db/migration/       # Flyway scripts
│   │   │       └── templates/          # Excel templates
│   │   └── test/                       # Unit & Integration tests
│   ├── pom.xml
│   ├── Dockerfile
│   ├── README.md
│   └── STRUCTURE.md
│
├── labodc-web-portal/             # ReactJS + TypeScript Frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/                     # Images, fonts, icons
│   │   ├── components/
│   │   │   ├── common/                # Reusable components
│   │   │   ├── forms/                 # Form components
│   │   │   └── layout/                # Header, Footer, Sidebar
│   │   ├── hooks/                      # Custom React hooks
│   │   ├── pages/
│   │   │   ├── admin/                 # Lab Admin pages
│   │   │   ├── auth/                  # Login, Register
│   │   │   ├── enterprise/            # Enterprise dashboard
│   │   │   ├── mentor/                # Mentor dashboard
│   │   │   ├── system-admin/          # System Admin panel
│   │   │   └── talent/                # Talent portal
│   │   ├── services/                   # API services
│   │   ├── store/                      # Redux/Context state
│   │   ├── styles/                     # Global styles
│   │   ├── types/                      # TypeScript types
│   │   ├── utils/                      # Utility functions
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── README.md
│
├── labodc-mobile/                 # Flutter Mobile App
│   ├── android/                        # Android project
│   ├── ios/                            # iOS project
│   ├── lib/
│   │   ├── core/
│   │   │   ├── constants/
│   │   │   ├── network/
│   │   │   ├── routes/
│   │   │   └── theme/
│   │   ├── models/                     # Data models
│   │   ├── providers/                  # State management
│   │   ├── screens/
│   │   │   ├── auth/
│   │   │   ├── enterprise/
│   │   │   ├── mentor/
│   │   │   └── talent/
│   │   ├── services/                   # API services
│   │   ├── utils/                      # Utilities
│   │   ├── widgets/                    # Reusable widgets
│   │   └── main.dart
│   ├── assets/
│   │   ├── fonts/
│   │   └── images/
│   ├── test/
│   ├── pubspec.yaml
│   └── README.md
│
├── docs/                          # Project Documentation
│   ├── URD/                            # User Requirements Document
│   ├── SRS/                            # Software Requirements Specification
│   ├── SAD/                            # Software Architecture Document
│   ├── DDD/                            # Detailed Design Document
│   ├── implementation/                 # Implementation docs
│   ├── testing/                        # Test documentation
│   ├── installation/                   # Installation guides
│   ├── source-code/                    # Code documentation
│   ├── deployment-package/             # Deployment docs
│   ├── uml-diagrams/                   # UML 2.0 diagrams
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

## 📊 Tech Stack Summary

### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Java 17
- **Database**: PostgreSQL 14+
- **Cache**: Redis
- **Search**: Elasticsearch
- **Build**: Maven

### Frontend Web
- **Framework**: ReactJS 18
- **Language**: TypeScript
- **State**: Redux Toolkit
- **UI**: Ant Design / Material-UI
- **Build**: Vite / Webpack

### Mobile
- **Framework**: Flutter 3.x
- **Language**: Dart 3.x
- **State**: Provider / Riverpod
- **Platform**: iOS & Android

### DevOps
- **Container**: Docker
- **Orchestration**: Kubernetes
- **Cloud**: AWS (EC2, RDS, S3, CloudFront)
- **CI/CD**: GitLab CI / GitHub Actions
- **Monitoring**: CloudWatch, ELK Stack

### Third-party
- **Payment**: PayOS
- **Storage**: Cloudinary
- **Auth**: JWT

## 🎯 Key Features by Module

### Enterprise Module
✅ Register & manage profile
✅ Submit project proposals
✅ Make payments (PayOS)
✅ View reports & evaluations
✅ Request changes/cancellations

### Talent Module
✅ Manage profile & skills
✅ Browse & join projects
✅ View assigned tasks
✅ Receive mentor feedback
✅ Performance tracking

### Mentor Module
✅ Accept project invitations
✅ Break down tasks (Excel templates)
✅ Evaluate talents
✅ Submit reports
✅ Confirm fund redistribution

### Lab Admin Module
✅ Validate enterprises & projects
✅ Manage mentors & talents
✅ Allocate funds (70/20/10)
✅ Publish transparency reports
✅ Approve/reject changes

### System Admin Module
✅ System configuration
✅ Role & permission management
✅ User management
✅ Template maintenance
