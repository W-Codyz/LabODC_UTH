import 'package:flutter/material.dart';
import 'package:labodc_mobile/widgets/common_widgets.dart';

class BrowseProjectsScreen extends StatelessWidget {
  const BrowseProjectsScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Duyệt Dự án')),
      body: const Center(child: EmptyState(icon: Icons.explore, message: 'Duyệt Dự án\n(Sẽ được triển khai)')),
    );
  }
}
