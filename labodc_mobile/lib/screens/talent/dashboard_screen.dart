import 'package:flutter/material.dart';
import 'package:labodc_mobile/widgets/common_widgets.dart';

class TalentDashboardScreen extends StatelessWidget {
  const TalentDashboardScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Dashboard Sinh viên')),
      body: const Center(child: EmptyState(icon: Icons.dashboard, message: 'Dashboard Sinh viên\n(Sẽ được triển khai)')),
    );
  }
}
