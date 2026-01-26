import 'package:flutter/material.dart';
import 'package:labodc_mobile/widgets/common_widgets.dart';

class EnterpriseReportsScreen extends StatelessWidget {
  const EnterpriseReportsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Báo cáo')),
      body: const Center(
        child: EmptyState(
          icon: Icons.assessment,
          message: 'Báo cáo\n(Sẽ được triển khai)',
        ),
      ),
    );
  }
}
