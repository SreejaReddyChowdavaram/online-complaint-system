class AppConfig {
  static const String appName = 'JAN SUVIDHA';
  static const String appVersion = '1.0.0';
  
  // API Configuration
  static const String baseUrl = 'http://localhost:5000/api';
  static const String apiTimeout = '30s';
  
  // Google Maps Configuration
  static const String googleMapsApiKey = 'YOUR_GOOGLE_MAPS_API_KEY_HERE';
  
  // Storage Keys
  static const String tokenKey = 'auth_token';
  static const String userKey = 'user_data';
  
  // Complaint Categories
  static const List<String> complaintCategories = [
    'Road',
    'Water',
    'Electricity',
    'Sanitation',
    'Other'
  ];
  
  // Complaint Status
  static const List<String> complaintStatuses = [
    'Pending',
    'In Progress',
    'Resolved',
    'Rejected'
  ];
  
  // Priority Levels
  static const List<String> priorityLevels = [
    'Low',
    'Medium',
    'High',
    'Urgent'
  ];
}
