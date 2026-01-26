import 'package:flutter/material.dart';
import 'package:labodc_mobile/widgets/common_widgets.dart';

class MyProjectsScreen extends StatelessWidget {
  const MyProjectsScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Dự án của tôi')),
      body: const Center(child: EmptyState(icon: Icons.folder, message: 'Dự án của tôi\n(Sẽ được triển khai)')),
    );
  }
}
