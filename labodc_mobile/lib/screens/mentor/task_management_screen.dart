import 'package:flutter/material.dart';
import 'package:labodc_mobile/widgets/common_widgets.dart';
class TaskManagementScreen extends StatelessWidget {
  const TaskManagementScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(appBar: AppBar(title: const Text('Quản lý Nhiệm vụ')), body: const Center(child: EmptyState(icon: Icons.task_alt, message: 'Quản lý Nhiệm vụ\n(Sẽ được triển khai)')));
  }
}
