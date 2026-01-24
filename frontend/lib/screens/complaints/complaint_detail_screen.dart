import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../providers/complaint_provider.dart';
import '../../models/complaint_model.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/custom_text_field.dart';

class ComplaintDetailScreen extends StatefulWidget {
  final String complaintId;

  const ComplaintDetailScreen({
    super.key,
    required this.complaintId,
  });

  @override
  State<ComplaintDetailScreen> createState() => _ComplaintDetailScreenState();
}

class _ComplaintDetailScreenState extends State<ComplaintDetailScreen> {
  final _commentController = TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<ComplaintProvider>(context, listen: false)
          .getComplaint(widget.complaintId);
    });
  }

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }

  Future<void> _addComment() async {
    if (_commentController.text.trim().isEmpty) return;

    final complaintProvider =
        Provider.of<ComplaintProvider>(context, listen: false);
    final success = await complaintProvider.addComment(
      widget.complaintId,
      _commentController.text.trim(),
    );

    if (!mounted) return;

    if (success) {
      _commentController.clear();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Comment added successfully')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(complaintProvider.error ?? 'Failed to add comment'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'Pending':
        return Colors.orange;
      case 'In Progress':
        return Colors.blue;
      case 'Resolved':
        return Colors.green;
      case 'Rejected':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Complaint Details'),
      ),
      body: Consumer<ComplaintProvider>(
        builder: (context, complaintProvider, _) {
          if (complaintProvider.isLoading &&
              complaintProvider.selectedComplaint == null) {
            return const Center(child: CircularProgressIndicator());
          }

          final complaint = complaintProvider.selectedComplaint;
          if (complaint == null) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.error_outline, size: 64, color: Colors.red),
                  const SizedBox(height: 16),
                  Text(
                    complaintProvider.error ?? 'Complaint not found',
                    style: const TextStyle(color: Colors.red),
                  ),
                ],
              ),
            );
          }

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Status Chip
                Chip(
                  label: Text(complaint.status),
                  backgroundColor: _getStatusColor(complaint.status).withOpacity(0.2),
                  labelStyle: TextStyle(
                    color: _getStatusColor(complaint.status),
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 16),
                // Title
                Text(
                  complaint.title,
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
                const SizedBox(height: 8),
                // Category & Priority
                Row(
                  children: [
                    Chip(
                      label: Text(complaint.category),
                      avatar: const Icon(Icons.category, size: 18),
                    ),
                    const SizedBox(width: 8),
                    Chip(
                      label: Text(complaint.priority),
                      avatar: const Icon(Icons.flag, size: 18),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                // Description
                Text(
                  'Description',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
                const SizedBox(height: 8),
                Text(
                  complaint.description,
                  style: Theme.of(context).textTheme.bodyLarge,
                ),
                const SizedBox(height: 16),
                // Location
                Text(
                  'Location',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    const Icon(Icons.location_on, size: 20),
                    const SizedBox(width: 8),
                    Expanded(child: Text(complaint.location.address)),
                  ],
                ),
                const SizedBox(height: 16),
                // Submitted By
                Text(
                  'Submitted By',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
                const SizedBox(height: 8),
                Text(complaint.submittedBy.name),
                const SizedBox(height: 4),
                Text(
                  complaint.submittedBy.email,
                  style: Theme.of(context).textTheme.bodySmall,
                ),
                const SizedBox(height: 16),
                // Date
                Text(
                  'Created: ${DateFormat('MMM dd, yyyy').format(complaint.createdAt)}',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
                const Divider(height: 32),
                // Comments Section
                Text(
                  'Comments',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
                const SizedBox(height: 16),
                // Add Comment
                Row(
                  children: [
                    Expanded(
                      child: CustomTextField(
                        controller: _commentController,
                        hint: 'Add a comment...',
                        maxLines: 2,
                      ),
                    ),
                    const SizedBox(width: 8),
                    IconButton(
                      icon: const Icon(Icons.send),
                      onPressed: _addComment,
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                // Comments List
                if (complaint.comments.isEmpty)
                  const Padding(
                    padding: EdgeInsets.all(16.0),
                    child: Text('No comments yet'),
                  )
                else
                  ...complaint.comments.map((comment) => Card(
                        margin: const EdgeInsets.only(bottom: 8),
                        child: ListTile(
                          title: Text(comment.user.name),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(comment.text),
                              const SizedBox(height: 4),
                              Text(
                                DateFormat('MMM dd, yyyy HH:mm')
                                    .format(comment.createdAt),
                                style: Theme.of(context).textTheme.bodySmall,
                              ),
                            ],
                          ),
                        ),
                      )),
              ],
            ),
          );
        },
      ),
    );
  }
}
