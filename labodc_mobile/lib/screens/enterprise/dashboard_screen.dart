import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:labodc_mobile/core/routes/app_router.dart';
import 'package:labodc_mobile/core/theme/app_colors.dart';
import 'package:labodc_mobile/core/theme/app_text_styles.dart';
import 'package:labodc_mobile/providers/auth_provider.dart';
import 'package:labodc_mobile/widgets/common_widgets.dart';
import 'package:labodc_mobile/widgets/app_button.dart';

class EnterpriseDashboardScreen extends StatefulWidget {
  const EnterpriseDashboardScreen({super.key});

  @override
  State<EnterpriseDashboardScreen> createState() => _EnterpriseDashboardScreenState();
}

class _EnterpriseDashboardScreenState extends State<EnterpriseDashboardScreen> {
  // Mock data
  final Map<String, dynamic> _stats = {
    'totalProjects': 5,
    'activeProjects': 2,
    'completedProjects': 3,
    'totalSpent': 450000000,
  };
  
  final List<Map<String, dynamic>> _recentProjects = [
    {
      'id': 789,
      'title': 'Website Quản lý Bán hàng',
      'status': 'IN_PROGRESS',
      'progress': 65,
      'startDate': '2026-01-15',
      'endDate': '2026-05-31',
      'budget': 100000000,
      'studentCount': 5,
      'mentor': 'Nguyễn Văn Mentor',
    },
    {
      'id': 788,
      'title': 'Mobile App E-commerce',
      'status': 'PENDING',
      'progress': 0,
      'startDate': '2026-02-01',
      'endDate': '2026-08-01',
      'budget': 150000000,
      'studentCount': 6,
      'mentor': null,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard Doanh nghiệp'),
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
      body: RefreshIndicator(
        onRefresh: _handleRefresh,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Welcome Section
              Text(
                'Chào mừng trở lại!',
                style: AppTextStyles.heading3,
              ),
              const SizedBox(height: 4),
              Text(
                'Quản lý dự án và theo dõi tiến độ',
                style: AppTextStyles.body2.copyWith(
                  color: AppColors.textSecondary,
                ),
              ),
              const SizedBox(height: 24),
              
              // Statistics Cards
              Row(
                children: [
                  Expanded(
                    child: _buildStatCard(
                      'Tổng Dự án',
                      '${_stats['totalProjects']}',
                      Icons.folder,
                      AppColors.primary,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildStatCard(
                      'Đang chạy',
                      '${_stats['activeProjects']}',
                      Icons.hourglass_empty,
                      AppColors.warning,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: _buildStatCard(
                      'Hoàn thành',
                      '${_stats['completedProjects']}',
                      Icons.check_circle,
                      AppColors.success,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildStatCard(
                      'Tổng Chi',
                      '${_stats['totalSpent'] ~/ 1000000}M',
                      Icons.payments,
                      AppColors.info,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              
              // Quick Actions
              Text('Thao tác nhanh', style: AppTextStyles.heading4),
              const SizedBox(height: 12),
              _buildQuickActions(),
              const SizedBox(height: 24),
              
              // Recent Projects
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Dự án gần đây', style: AppTextStyles.heading4),
                  TextButton(
                    onPressed: () => context.push(AppRoutes.enterpriseProjects),
                    child: const Text('Xem tất cả'),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              _buildRecentProjects(),
            ],
          ),
        ),
      ),
    );
  }
  
  Widget _buildStatCard(String label, String value, IconData icon, Color color) {
    return AppCard(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Icon(icon, color: color, size: 32),
            const SizedBox(height: 8),
            Text(
              value,
              style: AppTextStyles.heading2.copyWith(color: color),
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: AppTextStyles.caption.copyWith(
                color: AppColors.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildQuickActions() {
    return Row(
      children: [
        Expanded(
          child: AppButton(
            text: 'Đề xuất\nDự án',
            icon: Icons.add_business,
            onPressed: () => context.push(AppRoutes.projectProposal),
            height: 80,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: AppButton(
            text: 'Dự án\ncủa tôi',
            icon: Icons.folder_open,
            onPressed: () => context.push(AppRoutes.enterpriseProjects),
            backgroundColor: AppColors.white,
            textColor: AppColors.primary,
            borderColor: AppColors.primary,
            height: 80,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: AppButton(
            text: 'Báo cáo\ntiến độ',
            icon: Icons.assessment,
            onPressed: () => context.push(AppRoutes.enterpriseReports),
            backgroundColor: AppColors.white,
            textColor: AppColors.primary,
            borderColor: AppColors.primary,
            height: 80,
          ),
        ),
      ],
    );
  }
  
  Widget _buildRecentProjects() {
    if (_recentProjects.isEmpty) {
      return const EmptyState(
        icon: Icons.folder_open,
        message: 'Chưa có dự án nào',
      );
    }
    
    return ListView.separated(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: _recentProjects.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final project = _recentProjects[index];
        return _buildProjectCard(project);
      },
    );
  }
  
  Widget _buildProjectCard(Map<String, dynamic> project) {
    final status = project['status'] as String;
    Color statusColor;
    String statusLabel;
    
    switch (status) {
      case 'IN_PROGRESS':
        statusColor = AppColors.info;
        statusLabel = 'Đang thực hiện';
        break;
      case 'PENDING':
        statusColor = AppColors.warning;
        statusLabel = 'Chờ duyệt';
        break;
      case 'COMPLETED':
        statusColor = AppColors.success;
        statusLabel = 'Hoàn thành';
        break;
      default:
        statusColor = AppColors.textSecondary;
        statusLabel = 'Không xác định';
    }
    
    return AppCard(
      child: InkWell(
        onTap: () {
          // TODO: Navigate to project detail
        },
        borderRadius: BorderRadius.circular(8),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Row(
                children: [
                  Expanded(
                    child: Text(
                      project['title'],
                      style: AppTextStyles.heading4,
                    ),
                  ),
                  StatusBadge(label: statusLabel, color: statusColor),
                ],
              ),
              const SizedBox(height: 12),
              
              // Progress (if in progress)
              if (status == 'IN_PROGRESS') ...[
                Row(
                  children: [
                    Expanded(
                      child: LinearProgressIndicator(
                        value: project['progress'] / 100,
                        backgroundColor: AppColors.backgroundGrey,
                        valueColor: AlwaysStoppedAnimation(statusColor),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      '${project['progress']}%',
                      style: AppTextStyles.caption.copyWith(
                        color: AppColors.textSecondary,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
              ],
              
              // Info
              Wrap(
                spacing: 16,
                runSpacing: 8,
                children: [
                  _buildInfoChip(Icons.payments, '${project['budget'] ~/ 1000000}M VNĐ'),
                  _buildInfoChip(Icons.people, '${project['studentCount']} SV'),
                  _buildInfoChip(Icons.event, '${project['startDate']} - ${project['endDate']}'),
                ],
              ),
              
              if (project['mentor'] != null) ...[
                const SizedBox(height: 8),
                _buildInfoChip(Icons.person, project['mentor']),
              ],
            ],
          ),
        ),
      ),
    );
  }
  
  Widget _buildInfoChip(IconData icon, String label) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 14, color: AppColors.textSecondary),
        const SizedBox(width: 4),
        Text(
          label,
          style: AppTextStyles.caption.copyWith(
            color: AppColors.textSecondary,
          ),
        ),
      ],
    );
  }
  
  Future<void> _handleRefresh() async {
    // TODO: Fetch data from API
    await Future.delayed(const Duration(seconds: 1));
    if (mounted) {
      setState(() {});
    }
  }
}
