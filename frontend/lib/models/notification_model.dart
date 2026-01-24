class Notification {
  final String id;
  final String type;
  final String title;
  final String message;
  final String? complaintId;
  final bool read;
  final DateTime? readAt;
  final DateTime createdAt;

  Notification({
    required this.id,
    required this.type,
    required this.title,
    required this.message,
    this.complaintId,
    required this.read,
    this.readAt,
    required this.createdAt,
  });

  factory Notification.fromJson(Map<String, dynamic> json) {
    return Notification(
      id: json['_id'] ?? json['id'] ?? '',
      type: json['type'] ?? 'general',
      title: json['title'] ?? '',
      message: json['message'] ?? '',
      complaintId: json['complaintId']?['_id'] ?? json['complaintId'],
      read: json['read'] ?? false,
      readAt: json['readAt'] != null
          ? DateTime.parse(json['readAt'])
          : null,
      createdAt: DateTime.parse(json['createdAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'type': type,
      'title': title,
      'message': message,
      'complaintId': complaintId,
      'read': read,
      'readAt': readAt?.toIso8601String(),
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
