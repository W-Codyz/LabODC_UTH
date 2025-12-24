# LabOdc Web Portal - ReactJS + TypeScript

## 📁 Cấu trúc thư mục

```
labodc-web-portal/
├── public/                    # Static assets
├── src/
│   ├── assets/               # Images, fonts, icons
│   ├── components/           # Reusable components
│   │   ├── common/          # Common components (Button, Input, etc.)
│   │   ├── forms/           # Form components
│   │   └── layout/          # Layout components (Header, Footer, Sidebar)
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page components
│   │   ├── admin/          # Lab Admin pages
│   │   ├── auth/           # Login, Register pages
│   │   ├── enterprise/     # Enterprise dashboard pages
│   │   ├── mentor/         # Mentor dashboard pages
│   │   ├── system-admin/   # System Admin pages
│   │   └── talent/         # Talent portal pages
│   ├── services/            # API services
│   ├── store/               # State management (Redux/Context)
│   ├── styles/              # Global styles, themes
│   ├── types/               # TypeScript types & interfaces
│   ├── utils/               # Utility functions
│   ├── App.tsx              # Main App component
│   └── index.tsx            # Entry point
├── package.json
├── tsconfig.json
└── README.md
```

## 🎨 Các trang chính

### Authentication
- Login
- Register (Enterprise, Talent, Mentor)
- Forgot Password
- Profile Setup

### Enterprise Dashboard
- Dashboard Overview
- Submit Project Proposal
- Manage Projects
- Make Payments
- View Reports & Evaluations
- Request Changes/Cancellations

### Talent Portal
- Dashboard
- Browse Available Projects
- My Projects
- View Tasks & Assignments
- Performance Reports
- Profile & Skills Management

### Mentor Dashboard
- Dashboard Overview
- Accept Project Invitations
- Task Management (Excel templates)
- Talent Evaluation
- Submit Reports
- Team Lead Appointment

### Lab Admin Dashboard
- Manage Enterprises
- Validate Projects
- Manage Mentors & Talents
- Fund Allocation (70/20/10)
- Transparency Reports
- Approve/Reject Changes

### System Admin Dashboard
- System Configuration
- Role & Permission Management
- User Management
- Excel Template Management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
cd labodc-web-portal

# Install dependencies
npm install
# or
yarn install

# Run development server
npm run dev
# or
yarn dev
```

### Environment Variables

Create `.env.local`:

```env
REACT_APP_API_BASE_URL=http://localhost:8080/api
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_preset
```

## 📦 Tech Stack

- **React 18**: UI library
- **TypeScript**: Type safety
- **React Router v6**: Routing
- **Redux Toolkit**: State management
- **Axios**: HTTP client
- **Ant Design / Material-UI**: UI components
- **React Hook Form**: Form handling
- **Chart.js / Recharts**: Data visualization
- **TailwindCSS**: Utility-first CSS

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🏗️ Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Responsive Design

Website được thiết kế responsive cho:
- Desktop (1920px+)
- Laptop (1366px+)
- Tablet (768px+)
- Mobile (375px+)
