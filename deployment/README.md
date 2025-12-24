# Deployment Configuration

## 📁 Cấu trúc thư mục

```
deployment/
├── docker/                 # Docker configurations
│   ├── backend/           # Backend Dockerfile
│   ├── frontend/          # Frontend Dockerfile
│   └── docker-compose.yml # Docker Compose setup
├── kubernetes/            # Kubernetes manifests
│   ├── backend/          # Backend K8s resources
│   ├── frontend/         # Frontend K8s resources
│   ├── database/         # Database resources
│   └── ingress/          # Ingress configurations
├── aws/                  # AWS deployment
│   ├── terraform/        # Infrastructure as Code
│   ├── cloudformation/   # CloudFormation templates
│   └── scripts/          # AWS CLI scripts
├── nginx/                # Nginx configurations
│   ├── nginx.conf       # Main config
│   └── sites/           # Virtual host configs
└── scripts/              # Deployment scripts
    ├── deploy.sh        # Main deployment script
    ├── rollback.sh      # Rollback script
    └── health-check.sh  # Health check script
```

## 🐳 Docker Deployment

### Development

```bash
cd deployment/docker
docker-compose up -d
```

### Production

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

## ☸️ Kubernetes Deployment

```bash
# Apply configurations
kubectl apply -f kubernetes/

# Check status
kubectl get pods
kubectl get services

# Scale deployment
kubectl scale deployment labodc-backend --replicas=3
```

## ☁️ AWS Deployment

### Using Terraform

```bash
cd aws/terraform
terraform init
terraform plan
terraform apply
```

### Services Used
- **EC2**: Application servers
- **RDS**: PostgreSQL database
- **ElastiCache**: Redis cache
- **S3**: Static assets & backups
- **CloudFront**: CDN
- **Route53**: DNS management
- **ELB**: Load balancing
- **ECS/EKS**: Container orchestration

## 🔄 CI/CD Pipeline

### GitLab CI / GitHub Actions

```yaml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  script:
    - npm test
    - mvn test

build:
  stage: build
  script:
    - docker build -t labodc-backend:latest ./labodc-backend
    - docker build -t labodc-frontend:latest ./labodc-web-portal

deploy:
  stage: deploy
  script:
    - ./deployment/scripts/deploy.sh
  only:
    - main
```

## 🔒 Security

- SSL/TLS certificates (Let's Encrypt)
- JWT authentication
- API rate limiting
- Database encryption
- Environment variables management
- Secrets management (AWS Secrets Manager)

## 📊 Monitoring

- **Application**: Spring Boot Actuator
- **Infrastructure**: AWS CloudWatch
- **Logs**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **APM**: New Relic / Datadog
- **Uptime**: Pingdom / UptimeRobot

## 🚨 Backup & Recovery

- Database backups: Daily automated
- Application backups: Weekly
- Retention period: 30 days
- Recovery time objective (RTO): < 1 hour
- Recovery point objective (RPO): < 15 minutes

## 📝 Health Checks

```bash
# Backend health
curl http://localhost:8080/actuator/health

# Frontend health
curl http://localhost:3000/health

# Database health
pg_isready -h localhost -p 5432
```
