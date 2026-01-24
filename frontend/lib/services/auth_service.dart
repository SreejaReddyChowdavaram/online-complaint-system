import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../config/app_config.dart';
import '../models/user_model.dart';
import 'api_service.dart';

class AuthService {
  final ApiService _apiService = ApiService();

  // Register user
  Future<Map<String, dynamic>> register({
    required String name,
    required String email,
    required String password,
    required String phone,
  }) async {
    try {
      final response = await _apiService.post(
        '/auth/register',
        {
          'name': name,
          'email': email,
          'password': password,
          'phone': phone,
        },
        includeAuth: false,
      );

      if (response['success'] == true) {
        await _saveToken(response['token']);
        await _saveUser(response['data']);
        return {
          'success': true,
          'user': User.fromJson(response['data']),
          'token': response['token'],
        };
      }

      throw Exception(response['error'] ?? 'Registration failed');
    } catch (e) {
      throw Exception('Registration error: $e');
    }
  }

  // Login user
  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _apiService.post(
        '/auth/login',
        {
          'email': email,
          'password': password,
        },
        includeAuth: false,
      );

      if (response['success'] == true) {
        await _saveToken(response['token']);
        await _saveUser(response['data']);
        return {
          'success': true,
          'user': User.fromJson(response['data']),
          'token': response['token'],
        };
      }

      throw Exception(response['error'] ?? 'Login failed');
    } catch (e) {
      throw Exception('Login error: $e');
    }
  }

  // Get current user
  Future<User> getCurrentUser() async {
    try {
      final response = await _apiService.get('/auth/me');
      if (response['success'] == true) {
        await _saveUser(response['data']);
        return User.fromJson(response['data']);
      }
      throw Exception('Failed to get user');
    } catch (e) {
      throw Exception('Get user error: $e');
    }
  }

  // Update password
  Future<void> updatePassword({
    required String currentPassword,
    required String newPassword,
  }) async {
    try {
      final response = await _apiService.put(
        '/auth/updatepassword',
        {
          'currentPassword': currentPassword,
          'newPassword': newPassword,
        },
      );

      if (response['success'] != true) {
        throw Exception(response['error'] ?? 'Password update failed');
      }
    } catch (e) {
      throw Exception('Password update error: $e');
    }
  }

  // Logout
  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(AppConfig.tokenKey);
    await prefs.remove(AppConfig.userKey);
  }

  // Check if user is logged in
  Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString(AppConfig.tokenKey);
    return token != null && token.isNotEmpty;
  }

  // Get saved user
  Future<User?> getSavedUser() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final userJson = prefs.getString(AppConfig.userKey);
      if (userJson != null) {
        return User.fromJson(json.decode(userJson));
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  // Save token
  Future<void> _saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(AppConfig.tokenKey, token);
  }

  // Save user
  Future<void> _saveUser(Map<String, dynamic> userData) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(AppConfig.userKey, json.encode(userData));
  }
}
