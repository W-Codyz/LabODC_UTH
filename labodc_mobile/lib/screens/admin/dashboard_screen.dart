import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:labodc_mobile/core/theme/app_colors.dart';
import 'package:labodc_mobile/core/theme/app_text_styles.dart';
import 'package:labodc_mobile/core/routes/app_router.dart';
import 'package:labodc_mobile/providers/auth_provider.dart';
import 'package:labodc_mobile/widgets/common_widgets.dart';

class AdminDashboardScreen extends StatelessWidget {
  const AdminDashboardScreen({super.key});
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard Admin'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            tooltip: 'Đăng xuất',
            onPressed: () async {
              final authProvider = context.read<AuthProvider>();
              await authProvider.logout();
              if (context.mounted) {
                context.go(AppRoutes.login);
              }
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Welcome Section
            Text(
              'Chào mừng, Lab Admin',
              style: AppTextStyles.heading2,
            ),
            const SizedBox(height: 8),
            Text(
              'Quản lý và giám sát hệ thống LabOdc',
              style: AppTextStyles.body2.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: 24),
            
            // Statistics Cards
            _buildStatisticsCards(),
            const SizedBox(height: 24),
            
            // Quick Actions
            Text(
              'Chức năng chính',
              style: AppTextStyles.heading3,
            ),
            const SizedBox(height: 16),
            _buildQuickActions(context),
            
            const SizedBox(height: 24),
            
            // Recent Activities
            Text(
              'Hoạt động gần đây',
              style: AppTextStyles.heading3,
            ),
            const SizedBox(height: 16),
            _buildRecentActivities(),
          ],
        ),
      ),
    );
  }
  
  Widget _buildStatisticsCards() {
    return Row(
      children: [
        Expanded(
          child: _buildStatCard(
            'Doanh nghiệp\nChờ duyệt',
            '5',
            Icons.business,
            AppColors.warning,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildStatCard(
            'Dự án\nChờ duyệt',
            '8',
            Icons.assignment,
            AppColors.primary,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildStatCard(
            'Quỹ\nChờ giải ngân',
            '3',
            Icons.payments,
            AppColors.success,
          ),
        ),
      ],
    );
  }
  
  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return AppCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Icon(icon, size: 32, color: color),
          const SizedBox(height: 8),
          Text(
            value,
            style: AppTextStyles.heading1.copyWith(color: color),
          ),
          const SizedBox(height: 4),
          Text(
            title,
            style: AppTextStyles.caption,
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
  
  Widget _buildQuickActions(BuildContext context) {
    return Column(
      children: [
        _buildActionButton(
          context,
          'Duyệt Doanh nghiệp',
          'Xác thực doanh nghiệp đăng ký mới',
          Icons.business_center,
          AppColors.primary,
          AppRoutes.adminEnterpriseManagement,
        ),
        const SizedBox(height: 12),
        _buildActionButton(
          context,
          'Duyệt Dự án',
          'Xác thực dự án và gán Mentor',
          Icons.assignment_turned_in,
          AppColors.info,
          AppRoutes.adminProjectValidation,
        ),
        const SizedBox(height: 12),
        _buildActionButton(
          context,
          'Quản lý Quỹ',
          'Phân bổ và giải ngân quỹ (70/20/10)',
          Icons.account_balance_wallet,
          AppColors.success,
          AppRoutes.adminFundAllocation,
        ),
      ],
    );
  }
  
  Widget _buildActionButton(
    BuildContext context,
    String title,
    String subtitle,
    IconData icon,
    Color color,
    String route,
  ) {
    return AppCard(
      onTap: () => context.push(route),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color, size: 28),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: AppTextStyles.subtitle1),
                  const SizedBox(height: 4),
                  Text(
                    subtitle,
                    style: AppTextStyles.caption.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(Icons.chevron_right, color: AppColors.textSecondary),
          ],
        ),
      ),
    );
  }
  
  Widget _buildRecentActivities() {
    return AppCard(
      child: Column(
        children: [
          _buildActivityItem(
            'ABC Technology đăng ký tài khoản',
            '5 phút trước',
            Icons.business,
            AppColors.info,
          ),
          const Divider(height: 1),
          _buildActivityItem(
            'Dự án "Website E-commerce" được submit',
            '1 giờ trước',
            Icons.assignment,
            AppColors.primary,
          ),
          const Divider(height: 1),
          _buildActivityItem(
            'Thanh toán 100M VNĐ đã được xác nhận',
            '2 giờ trước',
            Icons.payment,
            AppColors.success,
          ),
        ],
      ),
    );
  }
  
  Widget _buildActivityItem(
    String title,
    String time,
    IconData icon,
    Color color,
  ) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: AppTextStyles.body2),
                const SizedBox(height: 4),
                Text(
                  time,
                  style: AppTextStyles.caption.copyWith(
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
