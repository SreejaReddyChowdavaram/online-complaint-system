import 'user_model.dart';

class Location {
  final String address;
  final double? latitude;
  final double? longitude;

  Location({
    required this.address,
    this.latitude,
    this.longitude,
  });

  factory Location.fromJson(Map<String, dynamic> json) {
    return Location(
      address: json['address'] ?? '',
      latitude: json['coordinates']?['latitude']?.toDouble(),
      longitude: json['coordinates']?['longitude']?.toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'address': address,
      'coordinates': {
        'latitude': latitude,
        'longitude': longitude,
      },
    };
  }
}

class Attachment {
  final String filename;
  final String path;
  final DateTime uploadedAt;

  Attachment({
    required this.filename,
    required this.path,
    required this.uploadedAt,
  });

  factory Attachment.fromJson(Map<String, dynamic> json) {
    return Attachment(
      filename: json['filename'] ?? '',
      path: json['path'] ?? '',
      uploadedAt: json['uploadedAt'] != null
          ? DateTime.parse(json['uploadedAt'])
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'filename': filename,
      'path': path,
      'uploadedAt': uploadedAt.toIso8601String(),
    };
  }
}

class Comment {
  final String id;
  final User user;
  final String text;
  final DateTime createdAt;

  Comment({
    required this.id,
    required this.user,
    required this.text,
    required this.createdAt,
  });

  factory Comment.fromJson(Map<String, dynamic> json) {
    return Comment(
      id: json['_id'] ?? json['id'] ?? '',
      user: User.fromJson(json['user'] ?? {}),
      text: json['text'] ?? '',
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user': user.toJson(),
      'text': text,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}

class StatusHistory {
  final String status;
  final User? changedBy;
  final DateTime changedAt;
  final String? notes;

  StatusHistory({
    required this.status,
    this.changedBy,
    required this.changedAt,
    this.notes,
  });

  factory StatusHistory.fromJson(Map<String, dynamic> json) {
    return StatusHistory(
      status: json['status'] ?? '',
      changedBy: json['changedBy'] != null
          ? User.fromJson(json['changedBy'])
          : null,
      changedAt: json['changedAt'] != null
          ? DateTime.parse(json['changedAt'])
          : DateTime.now(),
      notes: json['notes'],
    );
  }
}

class Complaint {
  final String id;
  final String complaintId;
  final String title;
  final String description;
  final String category;
  final String department;
  final Location location;
  final String? imageUrl;
  final String status;
  final String priority;
  final User submittedBy;
  final User? assignedTo;
  final List<Attachment> attachments;
  final List<Comment> comments;
  final List<StatusHistory> statusHistory;
  final DateTime? resolvedAt;
  final String? resolutionNotes;
  final DateTime createdAt;
  final DateTime updatedAt;

  Complaint({
    required this.id,
    required this.complaintId,
    required this.title,
    required this.description,
    required this.category,
    required this.department,
    required this.location,
    this.imageUrl,
    required this.status,
    required this.priority,
    required this.submittedBy,
    this.assignedTo,
    required this.attachments,
    required this.comments,
    required this.statusHistory,
    this.resolvedAt,
    this.resolutionNotes,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Complaint.fromJson(Map<String, dynamic> json) {
    return Complaint(
      id: json['_id'] ?? json['id'] ?? '',
      complaintId: json['complaintId'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      category: json['category'] ?? '',
      department: json['department'] ?? 'General',
      location: Location.fromJson(json['location'] ?? {}),
      imageUrl: json['imageUrl'],
      status: json['status'] ?? 'Pending',
      priority: json['priority'] ?? 'Medium',
      submittedBy: User.fromJson(json['submittedBy'] ?? {}),
      assignedTo: json['assignedTo'] != null
          ? User.fromJson(json['assignedTo'])
          : null,
      attachments: (json['attachments'] as List<dynamic>?)
              ?.map((e) => Attachment.fromJson(e))
              .toList() ??
          [],
      comments: (json['comments'] as List<dynamic>?)
              ?.map((e) => Comment.fromJson(e))
              .toList() ??
          [],
      statusHistory: (json['statusHistory'] as List<dynamic>?)
              ?.map((e) => StatusHistory.fromJson(e))
              .toList() ??
          [],
      resolvedAt: json['resolvedAt'] != null
          ? DateTime.parse(json['resolvedAt'])
          : null,
      resolutionNotes: json['resolutionNotes'],
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : DateTime.now(),
      updatedAt: json['updatedAt'] != null
          ? DateTime.parse(json['updatedAt'])
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'complaintId': complaintId,
      'title': title,
      'description': description,
      'category': category,
      'department': department,
      'location': location.toJson(),
      'imageUrl': imageUrl,
      'status': status,
      'priority': priority,
      'submittedBy': submittedBy.id,
      'assignedTo': assignedTo?.id,
      'attachments': attachments.map((e) => e.toJson()).toList(),
      'comments': comments.map((e) => e.toJson()).toList(),
      'statusHistory': statusHistory.map((e) => {
        'status': e.status,
        'changedBy': e.changedBy?.id,
        'changedAt': e.changedAt.toIso8601String(),
        'notes': e.notes,
      }).toList(),
      'resolvedAt': resolvedAt?.toIso8601String(),
      'resolutionNotes': resolutionNotes,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  Complaint copyWith({
    String? id,
    String? complaintId,
    String? title,
    String? description,
    String? category,
    String? department,
    Location? location,
    String? imageUrl,
    String? status,
    String? priority,
    User? submittedBy,
    User? assignedTo,
    List<Attachment>? attachments,
    List<Comment>? comments,
    List<StatusHistory>? statusHistory,
    DateTime? resolvedAt,
    String? resolutionNotes,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Complaint(
      id: id ?? this.id,
      complaintId: complaintId ?? this.complaintId,
      title: title ?? this.title,
      description: description ?? this.description,
      category: category ?? this.category,
      department: department ?? this.department,
      location: location ?? this.location,
      imageUrl: imageUrl ?? this.imageUrl,
      status: status ?? this.status,
      priority: priority ?? this.priority,
      submittedBy: submittedBy ?? this.submittedBy,
      assignedTo: assignedTo ?? this.assignedTo,
      attachments: attachments ?? this.attachments,
      comments: comments ?? this.comments,
      statusHistory: statusHistory ?? this.statusHistory,
      resolvedAt: resolvedAt ?? this.resolvedAt,
      resolutionNotes: resolutionNotes ?? this.resolutionNotes,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
