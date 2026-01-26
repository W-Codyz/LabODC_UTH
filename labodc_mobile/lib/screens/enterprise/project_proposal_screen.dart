import 'package:flutter/material.dart';
import 'package:labodc_mobile/widgets/common_widgets.dart';

class ProjectProposalScreen extends StatelessWidget {
  const ProjectProposalScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Đề xuất Dự án')),
      body: const Center(
        child: EmptyState(
          icon: Icons.assignment,
          message: 'Đề xuất Dự án\n(Sẽ được triển khai)',
        ),
      ),
    );
  }
}
