import 'package:flutter/material.dart';
import 'package:labodc_mobile/widgets/common_widgets.dart';

class ForgotPasswordScreen extends StatelessWidget {
  const ForgotPasswordScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Quên mật khẩu')),
      body: const Center(
        child: EmptyState(
          icon: Icons.lock_reset,
          message: 'Màn hình quên mật khẩu\n(Sẽ được triển khai)',
        ),
      ),
    );
  }
}
