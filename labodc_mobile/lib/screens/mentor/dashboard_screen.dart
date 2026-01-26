import 'package:flutter/material.dart';
import 'package:labodc_mobile/widgets/common_widgets.dart';
class MentorDashboardScreen extends StatelessWidget {
  const MentorDashboardScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(appBar: AppBar(title: const Text('Dashboard Mentor')), body: const Center(child: EmptyState(icon: Icons.dashboard, message: 'Dashboard Mentor\n(Sẽ được triển khai)')));
  }
}
