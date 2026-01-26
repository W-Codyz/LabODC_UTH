import 'package:flutter/material.dart';
import 'package:labodc_mobile/widgets/common_widgets.dart';

class EnterpriseDashboardScreen extends StatelessWidget {
  const EnterpriseDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Dashboard Doanh nghiệp')),
      body: const Center(
        child: EmptyState(
          icon: Icons.business,
          message: 'Dashboard Doanh nghiệp\n(Sẽ được triển khai)',
        ),
      ),
    );
  }
}
