import 'package:flutter/foundation.dart';
import '../models/complaint_model.dart';
import '../services/complaint_service.dart';

class ComplaintProvider with ChangeNotifier {
  final ComplaintService _complaintService = ComplaintService();

  List<Complaint> _complaints = [];
  Complaint? _selectedComplaint;
  bool _isLoading = false;
  String? _error;
  bool _hasMore = true;
  int _currentPage = 1;

  List<Complaint> get complaints => _complaints;
  Complaint? get selectedComplaint => _selectedComplaint;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get hasMore => _hasMore;

  // Get all complaints
  Future<void> getComplaints({
    String? status,
    String? category,
    String? submittedBy,
    bool refresh = false,
  }) async {
    if (refresh) {
      _currentPage = 1;
      _complaints = [];
      _hasMore = true;
    }

    if (!_hasMore || _isLoading) return;

    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final newComplaints = await _complaintService.getComplaints(
        status: status,
        category: category,
        submittedBy: submittedBy,
        page: _currentPage,
        limit: 10,
      );

      if (refresh) {
        _complaints = newComplaints;
      } else {
        _complaints.addAll(newComplaints);
      }

      _hasMore = newComplaints.length >= 10;
      _currentPage++;
      _error = null;
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Get single complaint by ID
  Future<Complaint?> getComplaint(String id) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _selectedComplaint = await _complaintService.getComplaint(id);
      _error = null;
      _isLoading = false;
      notifyListeners();
      return _selectedComplaint;
    } catch (e) {
      _error = e.toString();
      _selectedComplaint = null;
      _isLoading = false;
      notifyListeners();
      return null;
    }
  }

  // Get complaint by complaint ID (for public tracking)
  Future<Complaint?> getComplaintByComplaintId(String complaintId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _selectedComplaint = await _complaintService.getComplaintByComplaintId(complaintId);
      _error = null;
      _isLoading = false;
      notifyListeners();
      return _selectedComplaint;
    } catch (e) {
      _error = e.toString();
      _selectedComplaint = null;
      _isLoading = false;
      notifyListeners();
      return null;
    }
  }

  // Create complaint
  Future<bool> createComplaint({
    required String title,
    required String description,
    required String category,
    required String address,
    double? latitude,
    double? longitude,
    String priority = 'Medium',
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final complaint = await _complaintService.createComplaint(
        title: title,
        description: description,
        category: category,
        address: address,
        latitude: latitude,
        longitude: longitude,
        priority: priority,
      );

      _complaints.insert(0, complaint);
      _error = null;
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Update complaint
  Future<bool> updateComplaint(String id, Map<String, dynamic> data) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final updatedComplaint = await _complaintService.updateComplaint(id, data);

      final index = _complaints.indexWhere((c) => c.id == id);
      if (index != -1) {
        _complaints[index] = updatedComplaint;
      }

      if (_selectedComplaint?.id == id) {
        _selectedComplaint = updatedComplaint;
      }

      _error = null;
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Delete complaint
  Future<bool> deleteComplaint(String id) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      await _complaintService.deleteComplaint(id);
      _complaints.removeWhere((c) => c.id == id);
      if (_selectedComplaint?.id == id) {
        _selectedComplaint = null;
      }
      _error = null;
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Add comment
  Future<bool> addComment(String complaintId, String text) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final updatedComplaint = await _complaintService.addComment(
        complaintId,
        text,
      );

      final index = _complaints.indexWhere((c) => c.id == complaintId);
      if (index != -1) {
        _complaints[index] = updatedComplaint;
      }

      if (_selectedComplaint?.id == complaintId) {
        _selectedComplaint = updatedComplaint;
      }

      _error = null;
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Clear selected complaint
  void clearSelectedComplaint() {
    _selectedComplaint = null;
    notifyListeners();
  }

  // Clear error
  void clearError() {
    _error = null;
    notifyListeners();
  }
}
