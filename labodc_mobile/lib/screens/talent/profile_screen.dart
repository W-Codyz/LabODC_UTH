import 'package:flutter/material.dart';
import 'package:labodc_mobile/widgets/common_widgets.dart';

class TalentProfileScreen extends StatelessWidget {
  const TalentProfileScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Hồ sơ')),
      body: const Center(child: EmptyState(icon: Icons.person, message: 'Hồ sơ\n(Sẽ được triển khai)')),
    );
  }
}
