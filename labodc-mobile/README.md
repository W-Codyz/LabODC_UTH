# LabOdc Mobile App - Flutter

## 📁 Cấu trúc thư mục

```
labodc-mobile/
├── android/                 # Android platform files
├── ios/                    # iOS platform files
├── lib/
│   ├── core/              # Core functionality
│   │   ├── constants/    # App constants
│   │   ├── network/      # API client, interceptors
│   │   ├── theme/        # App theme & colors
│   │   └── routes/       # Route definitions
│   ├── models/           # Data models
│   ├── providers/        # State management (Provider/Riverpod)
│   ├── screens/          # UI screens
│   │   ├── auth/        # Authentication screens
│   │   ├── enterprise/  # Enterprise screens
│   │   ├── mentor/      # Mentor screens
│   │   └── talent/      # Talent screens
│   ├── services/         # API services
│   ├── utils/            # Utility functions
│   ├── widgets/          # Reusable widgets
│   └── main.dart         # Entry point
├── assets/
│   ├── fonts/           # Custom fonts
│   └── images/          # Images & icons
├── test/                # Unit & widget tests
├── pubspec.yaml         # Dependencies
└── README.md
```

## 📱 Tính năng chính

### For Talents
- 📋 Browse available projects
- ✅ Join projects
- 📊 View tasks & progress
- 💬 Chat with mentor
- 📈 Performance reports
- 👤 Profile management

### For Enterprises
- 🏢 Submit project proposals
- 💰 Make payments
- 📑 View project reports
- ⭐ Evaluate team performance
- 🔔 Notifications

### For Mentors
- 👥 Manage team
- ✏️ Assign tasks
- 📝 Submit reports
- 💯 Evaluate talents
- 📊 Track progress

## 🚀 Getting Started

### Prerequisites
- Flutter SDK 3.0+
- Dart 3.0+
- Android Studio / Xcode
- VS Code with Flutter extension

### Installation

```bash
cd labodc-mobile

# Get dependencies
flutter pub get

# Run app
flutter run
```

### Environment Variables

Create `lib/core/config/env.dart`:

```dart
class Environment {
  static const String apiBaseUrl = 'http://localhost:8080/api';
  static const String cloudinaryCloudName = 'your_cloud_name';
  static const String cloudinaryUploadPreset = 'your_preset';
}
```

## 📦 Dependencies

Key packages:
- **http / dio**: API calls
- **provider / riverpod**: State management
- **shared_preferences**: Local storage
- **flutter_secure_storage**: Secure storage
- **image_picker**: Image selection
- **cached_network_image**: Image caching
- **flutter_local_notifications**: Push notifications
- **charts_flutter**: Charts & graphs
- **intl**: Internationalization

## 🎨 Design

- Material Design 3
- Custom theme colors
- Dark/Light mode support
- Responsive layout

## 🧪 Testing

```bash
# Run all tests
flutter test

# Run specific test
flutter test test/widget_test.dart

# Run with coverage
flutter test --coverage
```

## 🏗️ Build

```bash
# Build Android APK
flutter build apk --release

# Build Android App Bundle
flutter build appbundle --release

# Build iOS
flutter build ios --release
```

## 📱 Supported Platforms

- Android 6.0+ (API 23+)
- iOS 12.0+

## 🌐 Localization

App hỗ trợ:
- Tiếng Việt (vi)
- English (en)
