import 'package:flutter/material.dart';
import 'package:labodc_mobile/widgets/common_widgets.dart';

class EnterprisePaymentScreen extends StatelessWidget {
  const EnterprisePaymentScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Thanh toán')),
      body: const Center(
        child: EmptyState(
          icon: Icons.payment,
          message: 'Thanh toán\n(Sẽ được triển khai)',
        ),
      ),
    );
  }
}
