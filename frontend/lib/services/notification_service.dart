import '../models/notification_model.dart';
import 'api_service.dart';

class NotificationService {
  final ApiService _apiService = ApiService();

  // Get all notifications for current user
  Future<List<Notification>> getNotifications({
    bool unreadOnly = false,
    int limit = 50,
    int page = 1,
  }) async {
    try {
      final queryParams = <String, String>{
        'limit': limit.toString(),
        'page': page.toString(),
      };
      if (unreadOnly) queryParams['unreadOnly'] = 'true';

      final response = await _apiService.get(
        '/notifications',
        queryParams: queryParams,
      );

      if (response['success'] == true) {
        final List<dynamic> data = response['data'] ?? [];
        return data.map((json) => Notification.fromJson(json)).toList();
      }

      throw Exception('Failed to fetch notifications');
    } catch (e) {
      throw Exception('Get notifications error: $e');
    }
  }

  // Get unread count
  Future<int> getUnreadCount() async {
    try {
      final response = await _apiService.get('/notifications/unread-count');

      if (response['success'] == true) {
        return response['unreadCount'] ?? 0;
      }

      throw Exception('Failed to get unread count');
    } catch (e) {
      throw Exception('Get unread count error: $e');
    }
  }

  // Mark notification as read
  Future<void> markAsRead(String notificationId) async {
    try {
      final response = await _apiService.put(
        '/notifications/$notificationId/read',
        {},
      );

      if (response['success'] != true) {
        throw Exception('Failed to mark notification as read');
      }
    } catch (e) {
      throw Exception('Mark as read error: $e');
    }
  }

  // Mark all notifications as read
  Future<void> markAllAsRead() async {
    try {
      final response = await _apiService.put(
        '/notifications/read-all',
        {},
      );

      if (response['success'] != true) {
        throw Exception('Failed to mark all as read');
      }
    } catch (e) {
      throw Exception('Mark all as read error: $e');
    }
  }

  // Delete notification
  Future<void> deleteNotification(String notificationId) async {
    try {
      final response = await _apiService.delete('/notifications/$notificationId');

      if (response['success'] != true) {
        throw Exception('Failed to delete notification');
      }
    } catch (e) {
      throw Exception('Delete notification error: $e');
    }
  }

  // Register device for push notifications
  Future<void> registerDevice({
    required String deviceToken,
    required String platform,
  }) async {
    try {
      final response = await _apiService.post(
        '/notifications/register-device',
        {
          'deviceToken': deviceToken,
          'platform': platform,
        },
      );

      if (response['success'] != true) {
        throw Exception('Failed to register device');
      }
    } catch (e) {
      throw Exception('Register device error: $e');
    }
  }
}
