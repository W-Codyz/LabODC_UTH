import 'package:flutter/material.dart';
import 'package:labodc_mobile/widgets/common_widgets.dart';
class ProjectInvitationsScreen extends StatelessWidget {
  const ProjectInvitationsScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(appBar: AppBar(title: const Text('Lời mời Dự án')), body: const Center(child: EmptyState(icon: Icons.mail, message: 'Lời mời Dự án\n(Sẽ được triển khai)')));
  }
}
