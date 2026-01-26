import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:labodc_mobile/core/routes/app_router.dart';
import 'package:labodc_mobile/providers/auth_provider.dart';
import 'package:labodc_mobile/widgets/common_widgets.dart';

class TalentDashboardScreen extends StatelessWidget {
  const TalentDashboardScreen({super.key});
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard Sinh viên'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            tooltip: 'Đăng xuất',
            onPressed: () async {
              final authProvider = context.read<AuthProvider>();
              await authProvider.logout();
              if (context.mounted) {
                context.go(AppRoutes.login);
              }
            },
          ),
        ],
      ),
      body: const Center(
        child: EmptyState(
          icon: Icons.dashboard,
          message: 'Dashboard Sinh viên\n(Sẽ được triển khai)',
        ),
      ),
    );
  }
}
