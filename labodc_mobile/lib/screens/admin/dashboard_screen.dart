import 'package:flutter/material.dart';
import 'package:labodc_mobile/widgets/common_widgets.dart';
class AdminDashboardScreen extends StatelessWidget {
  const AdminDashboardScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(appBar: AppBar(title: const Text('Dashboard Admin')), body: const Center(child: EmptyState(icon: Icons.admin_panel_settings, message: 'Dashboard Admin\n(Sẽ được triển khai)')));
  }
}
