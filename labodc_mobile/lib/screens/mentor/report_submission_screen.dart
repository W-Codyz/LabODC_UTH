import 'package:flutter/material.dart';
import 'package:labodc_mobile/widgets/common_widgets.dart';
class ReportSubmissionScreen extends StatelessWidget {
  const ReportSubmissionScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(appBar: AppBar(title: const Text('Nộp Báo cáo')), body: const Center(child: EmptyState(icon: Icons.description, message: 'Nộp Báo cáo\n(Sẽ được triển khai)')));
  }
}
