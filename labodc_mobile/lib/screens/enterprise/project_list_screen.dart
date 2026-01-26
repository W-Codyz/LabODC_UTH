import 'package:flutter/material.dart';
import 'package:labodc_mobile/widgets/common_widgets.dart';

class EnterpriseProjectListScreen extends StatelessWidget {
  const EnterpriseProjectListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Danh sách Dự án')),
      body: const Center(
        child: EmptyState(
          icon: Icons.list_alt,
          message: 'Danh sách Dự án\n(Sẽ được triển khai)',
        ),
      ),
    );
  }
}
