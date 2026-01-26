import 'package:flutter/material.dart';
import 'package:labodc_mobile/widgets/common_widgets.dart';
class ProjectValidationScreen extends StatelessWidget {
  const ProjectValidationScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(appBar: AppBar(title: const Text('Xác thực Dự án')), body: const Center(child: EmptyState(icon: Icons.verified, message: 'Xác thực Dự án\n(Sẽ được triển khai)')));
  }
}
