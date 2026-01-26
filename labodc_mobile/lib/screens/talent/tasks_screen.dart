import 'package:flutter/material.dart';
import 'package:labodc_mobile/widgets/common_widgets.dart';

class TalentTasksScreen extends StatelessWidget {
  const TalentTasksScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Nhiệm vụ')),
      body: const Center(child: EmptyState(icon: Icons.task, message: 'Nhiệm vụ\n(Sẽ được triển khai)')),
    );
  }
}
