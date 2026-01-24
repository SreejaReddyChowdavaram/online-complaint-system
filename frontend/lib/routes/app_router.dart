import 'package:flutter/material.dart';
import '../screens/auth/login_screen.dart';
import '../screens/auth/register_screen.dart';
import '../screens/home/home_screen.dart';
import '../screens/complaints/complaint_list_screen.dart';
import '../screens/complaints/complaint_detail_screen.dart';
import '../screens/complaints/complaint_tracking_screen.dart';
import '../screens/complaints/create_complaint_screen.dart';
import '../screens/profile/profile_screen.dart';
import '../screens/splash_screen.dart';

class AppRouter {
  static const String splash = '/';
  static const String login = '/login';
  static const String register = '/register';
  static const String home = '/home';
  static const String complaintList = '/complaints';
  static const String complaintDetail = '/complaints/:id';
  static const String complaintTracking = '/complaints/track/:id';
  static const String createComplaint = '/complaints/create';
  static const String profile = '/profile';

  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case splash:
        return MaterialPageRoute(builder: (_) => const SplashScreen());
      
      case login:
        return MaterialPageRoute(builder: (_) => const LoginScreen());
      
      case register:
        return MaterialPageRoute(builder: (_) => const RegisterScreen());
      
      case home:
        return MaterialPageRoute(builder: (_) => const HomeScreen());
      
      case complaintList:
        return MaterialPageRoute(builder: (_) => const ComplaintListScreen());
      
      case complaintDetail:
        final id = settings.arguments as String?;
        return MaterialPageRoute(
          builder: (_) => ComplaintDetailScreen(complaintId: id ?? ''),
        );
      
      case complaintTracking:
        final id = settings.arguments as String?;
        return MaterialPageRoute(
          builder: (_) => ComplaintTrackingScreen(complaintId: id ?? ''),
        );
      
      case createComplaint:
        return MaterialPageRoute(builder: (_) => const CreateComplaintScreen());
      
      case profile:
        return MaterialPageRoute(builder: (_) => const ProfileScreen());
      
      default:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            body: Center(
              child: Text('No route defined for ${settings.name}'),
            ),
          ),
        );
    }
  }
}
