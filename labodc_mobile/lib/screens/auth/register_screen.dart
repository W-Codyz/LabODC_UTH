import 'package:flutter/material.dart';
import 'package:labodc_mobile/widgets/common_widgets.dart';

class RegisterScreen extends StatelessWidget {
  const RegisterScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Đăng ký')),
      body: const Center(
        child: EmptyState(
          icon: Icons.app_registration,
          message: 'Màn hình đăng ký\n(Sẽ được triển khai)',
        ),
      ),
    );
  }
}
