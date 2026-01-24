# JAN SUVIDHA - Flutter Frontend

Flutter mobile application for the JAN SUVIDHA civic complaint management system.

## Project Structure

```
lib/
├── config/              # App configuration
│   ├── app_config.dart
│   └── app_theme.dart
├── models/              # Data models
│   ├── complaint_model.dart
│   └── user_model.dart
├── providers/           # State management (Provider)
│   ├── auth_provider.dart
│   └── complaint_provider.dart
├── routes/              # Navigation routes
│   └── app_router.dart
├── screens/             # UI Screens
│   ├── auth/
│   │   ├── login_screen.dart
│   │   └── register_screen.dart
│   ├── complaints/
│   │   ├── complaint_list_screen.dart
│   │   ├── complaint_detail_screen.dart
│   │   └── create_complaint_screen.dart
│   ├── home/
│   │   └── home_screen.dart
│   ├── profile/
│   │   └── profile_screen.dart
│   └── splash_screen.dart
├── services/            # API services
│   ├── api_service.dart
│   ├── auth_service.dart
│   └── complaint_service.dart
├── utils/               # Utility functions
│   └── constants.dart
├── widgets/             # Reusable widgets
│   ├── complaint_card.dart
│   ├── custom_button.dart
│   └── custom_text_field.dart
└── main.dart            # App entry point
```

## Features

- **Authentication**: Login and registration with JWT
- **Complaint Management**: Create, view, and manage complaints
- **State Management**: Provider pattern for state management
- **Modern UI**: Material Design 3 with light/dark theme support
- **Form Validation**: Input validation for all forms
- **Error Handling**: Comprehensive error handling and user feedback

## Getting Started

1. Install Flutter dependencies:
```bash
flutter pub get
```

2. Update API base URL in `lib/config/app_config.dart`:
```dart
static const String baseUrl = 'http://your-backend-url/api';
```

3. Run the app:
```bash
flutter run
```

## Dependencies

- **provider**: State management
- **http**: HTTP requests
- **shared_preferences**: Local storage
- **google_fonts**: Custom fonts
- **intl**: Date formatting
- **geolocator**: Location services
- **image_picker**: Image selection

## Screens

- **Splash Screen**: Initial loading and auth check
- **Login/Register**: User authentication
- **Home Screen**: Main navigation with bottom bar
- **Complaint List**: View all complaints with filters
- **Complaint Detail**: View complaint details and comments
- **Create Complaint**: Submit new complaints
- **Profile**: User profile and settings

## State Management

The app uses the Provider pattern for state management:
- `AuthProvider`: Manages authentication state
- `ComplaintProvider`: Manages complaint data and operations

## API Integration

All API calls are handled through service classes:
- `ApiService`: Base HTTP service
- `AuthService`: Authentication endpoints
- `ComplaintService`: Complaint CRUD operations
