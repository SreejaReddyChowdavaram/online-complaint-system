import '../models/complaint_model.dart';
import 'api_service.dart';

class ComplaintService {
  final ApiService _apiService = ApiService();

  // Get all complaints
  Future<List<Complaint>> getComplaints({
    String? status,
    String? category,
    String? submittedBy,
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final queryParams = <String, String>{};
      if (status != null) queryParams['status'] = status;
      if (category != null) queryParams['category'] = category;
      if (submittedBy != null) queryParams['submittedBy'] = submittedBy;
      queryParams['page'] = page.toString();
      queryParams['limit'] = limit.toString();

      final response = await _apiService.get(
        '/complaints',
        queryParams: queryParams,
      );

      if (response['success'] == true) {
        final List<dynamic> data = response['data'] ?? [];
        return data.map((json) => Complaint.fromJson(json)).toList();
      }

      throw Exception('Failed to fetch complaints');
    } catch (e) {
      throw Exception('Get complaints error: $e');
    }
  }

  // Get single complaint by ID
  Future<Complaint> getComplaint(String id) async {
    try {
      final response = await _apiService.get('/complaints/$id');

      if (response['success'] == true) {
        return Complaint.fromJson(response['data']);
      }

      throw Exception('Complaint not found');
    } catch (e) {
      throw Exception('Get complaint error: $e');
    }
  }

  // Get complaint by complaint ID (for public tracking)
  Future<Complaint> getComplaintByComplaintId(String complaintId) async {
    try {
      final response = await _apiService.get(
        '/complaints/complaint-id/$complaintId',
        includeAuth: false, // Public endpoint
      );

      if (response['success'] == true) {
        return Complaint.fromJson(response['data']);
      }

      throw Exception('Complaint not found');
    } catch (e) {
      throw Exception('Get complaint error: $e');
    }
  }

  // Create complaint
  Future<Complaint> createComplaint({
    required String title,
    required String description,
    required String category,
    required String address,
    double? latitude,
    double? longitude,
    String priority = 'Medium',
  }) async {
    try {
      final response = await _apiService.post(
        '/complaints',
        {
          'title': title,
          'description': description,
          'category': category,
          'location': {
            'address': address,
            'coordinates': {
              'latitude': latitude,
              'longitude': longitude,
            },
          },
          'priority': priority,
        },
      );

      if (response['success'] == true) {
        return Complaint.fromJson(response['data']);
      }

      throw Exception('Failed to create complaint');
    } catch (e) {
      throw Exception('Create complaint error: $e');
    }
  }

  // Update complaint
  Future<Complaint> updateComplaint(
    String id,
    Map<String, dynamic> data,
  ) async {
    try {
      final response = await _apiService.put(
        '/complaints/$id',
        data,
      );

      if (response['success'] == true) {
        return Complaint.fromJson(response['data']);
      }

      throw Exception('Failed to update complaint');
    } catch (e) {
      throw Exception('Update complaint error: $e');
    }
  }

  // Delete complaint
  Future<void> deleteComplaint(String id) async {
    try {
      final response = await _apiService.delete('/complaints/$id');

      if (response['success'] != true) {
        throw Exception('Failed to delete complaint');
      }
    } catch (e) {
      throw Exception('Delete complaint error: $e');
    }
  }

  // Add comment to complaint
  Future<Complaint> addComment(String complaintId, String text) async {
    try {
      final response = await _apiService.post(
        '/complaints/$complaintId/comments',
        {'text': text},
      );

      if (response['success'] == true) {
        return Complaint.fromJson(response['data']);
      }

      throw Exception('Failed to add comment');
    } catch (e) {
      throw Exception('Add comment error: $e');
    }
  }
}
