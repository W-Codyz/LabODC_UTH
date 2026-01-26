import 'package:flutter/material.dart';
import 'package:labodc_mobile/widgets/common_widgets.dart';
class EnterpriseManagementScreen extends StatelessWidget {
  const EnterpriseManagementScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(appBar: AppBar(title: const Text('Quản lý Doanh nghiệp')), body: const Center(child: EmptyState(icon: Icons.business_center, message: 'Quản lý Doanh nghiệp\n(Sẽ được triển khai)')));
  }
}
