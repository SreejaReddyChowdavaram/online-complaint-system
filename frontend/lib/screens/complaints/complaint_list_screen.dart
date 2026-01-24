import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/complaint_provider.dart';
import '../../providers/auth_provider.dart';
import '../../routes/app_router.dart';
import '../../widgets/complaint_card.dart';

class ComplaintListScreen extends StatefulWidget {
  const ComplaintListScreen({super.key});

  @override
  State<ComplaintListScreen> createState() => _ComplaintListScreenState();
}

class _ComplaintListScreenState extends State<ComplaintListScreen> {
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final complaintProvider = Provider.of<ComplaintProvider>(context, listen: false);
      
      // For citizens, filter by their own complaints
      final userId = authProvider.user?.id;
      complaintProvider.getComplaints(
        submittedBy: userId, // Filter by current user
        refresh: true,
      );
    });
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent * 0.9) {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final complaintProvider = Provider.of<ComplaintProvider>(context, listen: false);
      
      final userId = authProvider.user?.id;
      complaintProvider.getComplaints(submittedBy: userId);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<ComplaintProvider>(
      builder: (context, complaintProvider, _) {
        if (complaintProvider.isLoading && complaintProvider.complaints.isEmpty) {
          return const Center(child: CircularProgressIndicator());
        }

        if (complaintProvider.error != null &&
            complaintProvider.complaints.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  'Error: ${complaintProvider.error}',
                  style: const TextStyle(color: Colors.red),
                ),
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: () {
                    final authProvider = Provider.of<AuthProvider>(context, listen: false);
                    final userId = authProvider.user?.id;
                    complaintProvider.getComplaints(
                      submittedBy: userId,
                      refresh: true,
                    );
                  },
                  child: const Text('Retry'),
                ),
              ],
            ),
          );
        }

        if (complaintProvider.complaints.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.inbox,
                  size: 64,
                  color: Colors.grey[400],
                ),
                const SizedBox(height: 16),
                Text(
                  'No complaints yet',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                const SizedBox(height: 8),
                Text(
                  'Tap the + button to create a complaint',
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
              ],
            ),
          );
        }

        return RefreshIndicator(
          onRefresh: () async {
            final authProvider = Provider.of<AuthProvider>(context, listen: false);
            final userId = authProvider.user?.id;
            await complaintProvider.getComplaints(
              submittedBy: userId,
              refresh: true,
            );
          },
          child: ListView.builder(
            controller: _scrollController,
            padding: const EdgeInsets.all(16),
            itemCount: complaintProvider.complaints.length +
                (complaintProvider.hasMore ? 1 : 0),
            itemBuilder: (context, index) {
              if (index >= complaintProvider.complaints.length) {
                return const Center(
                  child: Padding(
                    padding: EdgeInsets.all(16.0),
                    child: CircularProgressIndicator(),
                  ),
                );
              }

              final complaint = complaintProvider.complaints[index];
              return ComplaintCard(
                complaint: complaint,
                onTap: () {
                  Navigator.of(context).pushNamed(
                    AppRouter.complaintDetail,
                    arguments: complaint.id,
                  );
                },
              );
            },
          ),
        );
      },
    );
  }
}
