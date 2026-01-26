import 'package:flutter/material.dart';
import 'package:labodc_mobile/widgets/common_widgets.dart';
class EvaluationScreen extends StatelessWidget {
  const EvaluationScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(appBar: AppBar(title: const Text('Đánh giá')), body: const Center(child: EmptyState(icon: Icons.rate_review, message: 'Đánh giá\n(Sẽ được triển khai)')));
  }
}
