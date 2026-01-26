import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:labodc_mobile/core/routes/app_router.dart';
import 'package:labodc_mobile/core/theme/app_colors.dart';
import 'package:labodc_mobile/core/theme/app_text_styles.dart';
import 'package:labodc_mobile/widgets/common_widgets.dart';
import 'package:labodc_mobile/widgets/app_button.dart';

class EnterpriseProjectListScreen extends StatefulWidget {
  const EnterpriseProjectListScreen({super.key});

  @override
  State<EnterpriseProjectListScreen> createState() => _EnterpriseProjectListScreenState();
}

class _EnterpriseProjectListScreenState extends State<EnterpriseProjectListScreen> {
  String _selectedTab = 'all';
  final ScrollController _scrollController = ScrollController();
  final List<String> _tabValues = ['all', 'pending', 'in_progress', 'completed', 'rejected'];
  
  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }
  
  void _selectTab(String value) {
    setState(() => _selectedTab = value);
    
    // Calculate scroll position to center the selected tab
    final index = _tabValues.indexOf(value);
    if (index != -1) {
      // Approximate width of each tab (adjust if needed)
      const tabWidth = 150.0;
      final screenWidth = MediaQuery.of(context).size.width;
      final targetPosition = (index * tabWidth) - (screenWidth / 2) + (tabWidth / 2);
      
      _scrollController.animateTo(
        targetPosition.clamp(0.0, _scrollController.position.maxScrollExtent),
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }
  
  // Mock data
  final List<Map<String, dynamic>> _projects = [
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
      'payment': 'PAID',
      'createdAt': '2026-01-10',
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
      'payment': 'PENDING',
      'createdAt': '2026-01-12',
    },
    {
      'id': 787,
      'title': 'Hệ thống CRM',
      'status': 'COMPLETED',
      'progress': 100,
      'startDate': '2025-09-01',
      'endDate': '2025-12-31',
      'budget': 80000000,
      'studentCount': 4,
      'mentor': 'Trần Thị Mentor 2',
      'payment': 'PAID',
      'createdAt': '2025-08-25',
    },
    {
      'id': 786,
      'title': 'Dashboard Analytics',
      'status': 'REJECTED',
      'progress': 0,
      'startDate': null,
      'endDate': null,
      'budget': 50000000,
      'studentCount': 3,
      'mentor': null,
      'payment': null,
      'createdAt': '2026-01-05',
      'rejectionReason': 'Ngân sách không đủ cho phạm vi dự án yêu cầu',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dự án của tôi'),
      ),
      body: Column(
        children: [
          // Tab Bar
          Container(
            color: AppColors.white,
            height: 56,
            child: ListView(
              controller: _scrollController,
              scrollDirection: Axis.horizontal,
              children: [
                _buildTab('Tất cả', 'all', _projects.length),
                _buildTab('Chờ duyệt', 'pending', _getProjectsByStatus('PENDING').length),
                _buildTab('Đang thực hiện', 'in_progress', _getProjectsByStatus('IN_PROGRESS').length),
                _buildTab('Hoàn thành', 'completed', _getProjectsByStatus('COMPLETED').length),
                _buildTab('Đã từ chối', 'rejected', _getProjectsByStatus('REJECTED').length),
              ],
            ),
          ),
          const Divider(height: 1),
          
          // Content
          Expanded(
            child: _buildContent(),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.push(AppRoutes.projectProposal),
        icon: const Icon(Icons.add),
        label: const Text('Đề xuất dự án'),
      ),
    );
  }
  
  Widget _buildTab(String label, String value, int count) {
    final isSelected = _selectedTab == value;
    return InkWell(
      onTap: () => _selectTab(value),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        decoration: BoxDecoration(
          border: Border(
            bottom: BorderSide(
              color: isSelected ? AppColors.primary : Colors.transparent,
              width: 2,
            ),
          ),
        ),
        child: Row(
          children: [
            Text(
              label,
              style: AppTextStyles.subtitle2.copyWith(
                color: isSelected ? AppColors.primary : AppColors.textSecondary,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              ),
            ),
            if (count > 0) ...[
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: isSelected ? AppColors.primary : AppColors.textSecondary,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  '$count',
                  style: AppTextStyles.caption.copyWith(
                    color: AppColors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
  
  Widget _buildContent() {
    final filteredProjects = _selectedTab == 'all'
        ? _projects
        : _getProjectsByStatus(_selectedTab.toUpperCase());
    
    if (filteredProjects.isEmpty) {
      return const Center(
        child: EmptyState(
          icon: Icons.folder_open,
          message: 'Không có dự án nào',
        ),
      );
    }
    
    return RefreshIndicator(
      onRefresh: _handleRefresh,
      child: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: filteredProjects.length,
        separatorBuilder: (_, __) => const SizedBox(height: 16),
        itemBuilder: (context, index) {
          final project = filteredProjects[index];
          return _buildProjectCard(project);
        },
      ),
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
      case 'REJECTED':
        statusColor = AppColors.error;
        statusLabel = 'Đã từ chối';
        break;
      default:
        statusColor = AppColors.textSecondary;
        statusLabel = 'Không xác định';
    }
    
    return AppCard(
      child: InkWell(
        onTap: () => _viewProjectDetail(project),
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
              
              // Rejection reason
              if (status == 'REJECTED' && project['rejectionReason'] != null) ...[
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.error.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      Icon(Icons.info_outline, color: AppColors.error, size: 20),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'Lý do: ${project['rejectionReason']}',
                          style: AppTextStyles.caption.copyWith(
                            color: AppColors.error,
                          ),
                        ),
                      ),
                    ],
                  ),
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
                  if (project['startDate'] != null)
                    _buildInfoChip(Icons.event, project['startDate']),
                ],
              ),
              
              if (project['mentor'] != null) ...[
                const SizedBox(height: 8),
                _buildInfoChip(Icons.person, project['mentor']),
              ],
              
              const SizedBox(height: 12),
              const Divider(height: 1),
              const SizedBox(height: 12),
              
              // Actions
              _buildActions(project),
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
  
  Widget _buildActions(Map<String, dynamic> project) {
    final status = project['status'] as String;
    
    if (status == 'PENDING') {
      return Row(
        children: [
          Expanded(
            child: AppButton(
              text: 'Xem chi tiết',
              onPressed: () => _viewProjectDetail(project),
              backgroundColor: AppColors.white,
              textColor: AppColors.primary,
              borderColor: AppColors.primary,
              height: 40,
            ),
          ),
        ],
      );
    } else if (status == 'IN_PROGRESS') {
      return Row(
        children: [
          Expanded(
            child: AppButton(
              text: 'Xem báo cáo',
              onPressed: () => context.push(AppRoutes.enterpriseReports),
              backgroundColor: AppColors.white,
              textColor: AppColors.primary,
              borderColor: AppColors.primary,
              height: 40,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: AppButton(
              text: 'Chi tiết',
              onPressed: () => _viewProjectDetail(project),
              height: 40,
            ),
          ),
        ],
      );
    } else if (status == 'COMPLETED') {
      return Row(
        children: [
          Expanded(
            child: AppButton(
              text: 'Xem kết quả',
              onPressed: () => _viewProjectDetail(project),
              height: 40,
            ),
          ),
        ],
      );
    } else if (status == 'REJECTED') {
      return Row(
        children: [
          Expanded(
            child: AppButton(
              text: 'Đề xuất lại',
              onPressed: () => context.push(AppRoutes.projectProposal),
              height: 40,
            ),
          ),
        ],
      );
    }
    
    return const SizedBox.shrink();
  }
  
  List<Map<String, dynamic>> _getProjectsByStatus(String status) {
    return _projects.where((p) => p['status'] == status).toList();
  }
  
  void _viewProjectDetail(Map<String, dynamic> project) {
    // TODO: Navigate to project detail screen
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Xem chi tiết dự án #${project['id']}'),
        backgroundColor: AppColors.info,
      ),
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
