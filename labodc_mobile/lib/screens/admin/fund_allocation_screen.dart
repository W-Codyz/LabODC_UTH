import 'package:flutter/material.dart';
import 'package:labodc_mobile/widgets/common_widgets.dart';
class FundAllocationScreen extends StatelessWidget {
  const FundAllocationScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(appBar: AppBar(title: const Text('Phân bổ Quỹ')), body: const Center(child: EmptyState(icon: Icons.account_balance, message: 'Phân bổ Quỹ\n(Sẽ được triển khai)')));
  }
}
