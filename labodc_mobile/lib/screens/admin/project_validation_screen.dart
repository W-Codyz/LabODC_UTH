import 'package:flutter/material.dart';
import 'package:labodc_mobile/core/theme/app_colors.dart';
import 'package:labodc_mobile/core/theme/app_text_styles.dart';
import 'package:labodc_mobile/widgets/common_widgets.dart';
import 'package:labodc_mobile/widgets/app_button.dart';

class ProjectValidationScreen extends StatefulWidget {
  const ProjectValidationScreen({super.key});

  @override
  State<ProjectValidationScreen> createState() => _ProjectValidationScreenState();
}

class _ProjectValidationScreenState extends State<ProjectValidationScreen> {
  String _selectedTab = 'pending';
  
  // Mock data
  final List<Map<String, dynamic>> _pendingProjects = [
    {
      'id': 789,
      'title': 'Website Quản lý Bán hàng',
      'enterprise': 'ABC Technology Co., Ltd',
      'description': 'Xây dựng website quản lý bán hàng với các tính năng: quản lý sản phẩm, đơn hàng, khách hàng, báo cáo thống kê',
      'budget': 100000000,
      'duration': '6 tháng',
      'requiredTalents': 5,
      'technologies': ['React', 'Node.js', 'PostgreSQL'],
      'submittedAt': '2026-01-15',
      'status': 'PENDING',
    },
    {
      'id': 790,
      'title': 'Mobile App E-commerce',
      'enterprise': 'XYZ Corporation',
      'description': 'Phát triển ứng dụng di động bán hàng trực tuyến với tích hợp thanh toán và giao hàng',
      'budget': 150000000,
      'duration': '8 tháng',
      'requiredTalents': 6,
      'technologies': ['Flutter', 'Firebase', 'Node.js'],
      'submittedAt': '2026-01-16',
      'status': 'PENDING',
    },
  ];
  
  final List<Map<String, dynamic>> _availableMentors = [
    {
      'id': 201,
      'name': 'Nguyễn Văn Mentor',
      'expertise': ['React', 'Node.js', 'Flutter'],
      'currentProjects': 2,
      'maxProjects': 5,
      'rating': 4.8,
    },
    {
      'id': 202,
      'name': 'Trần Thị Mentor 2',
      'expertise': ['Java', 'Spring Boot', 'PostgreSQL'],
      'currentProjects': 1,
      'maxProjects': 5,
      'rating': 4.9,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Duyệt Dự án'),
      ),
      body: Column(
        children: [
          // Tab Bar
          Container(
            color: AppColors.white,
            child: Row(
              children: [
                _buildTab('Chờ duyệt', 'pending', _pendingProjects.length),
                _buildTab('Đã duyệt', 'approved', 0),
                _buildTab('Đã từ chối', 'rejected', 0),
              ],
            ),
          ),
          const Divider(height: 1),
          
          // Content
          Expanded(
            child: _selectedTab == 'pending' && _pendingProjects.isNotEmpty
                ? _buildPendingList()
                : const Center(
                    child: EmptyState(
                      icon: Icons.assignment,
                      message: 'Không có dự án nào',
                    ),
                  ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildTab(String label, String value, int count) {
    final isSelected = _selectedTab == value;
    return Expanded(
      child: InkWell(
        onTap: () => setState(() => _selectedTab = value),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 16),
          decoration: BoxDecoration(
            border: Border(
              bottom: BorderSide(
                color: isSelected ? AppColors.primary : Colors.transparent,
                width: 2,
              ),
            ),
          ),
          child: Column(
            children: [
              Text(
                label,
                style: AppTextStyles.subtitle2.copyWith(
                  color: isSelected ? AppColors.primary : AppColors.textSecondary,
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                ),
              ),
              if (count > 0) ...[
                const SizedBox(height: 4),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: AppColors.error,
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
      ),
    );
  }
  
  Widget _buildPendingList() {
    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: _pendingProjects.length,
      separatorBuilder: (_, __) => const SizedBox(height: 16),
      itemBuilder: (context, index) {
        final project = _pendingProjects[index];
        return _buildProjectCard(project);
      },
    );
  }
  
  Widget _buildProjectCard(Map<String, dynamic> project) {
    return AppCard(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(project['title'], style: AppTextStyles.heading3),
                      const SizedBox(height: 4),
                      Text(
                        project['enterprise'],
                        style: AppTextStyles.caption.copyWith(
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
                StatusBadge(label: 'Chờ duyệt', color: AppColors.warning),
              ],
            ),
            const SizedBox(height: 12),
            
            // Description
            Text(
              project['description'],
              style: AppTextStyles.body2,
              maxLines: 3,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 16),
            
            // Info Grid
            Wrap(
              spacing: 16,
              runSpacing: 12,
              children: [
                _buildInfoChip(Icons.payments, '${project['budget'] ~/ 1000000}M VNĐ'),
                _buildInfoChip(Icons.schedule, project['duration']),
                _buildInfoChip(Icons.people, '${project['requiredTalents']} SV'),
              ],
            ),
            const SizedBox(height: 12),
            
            // Technologies
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: (project['technologies'] as List<String>)
                  .map((tech) => Chip(
                        label: Text(tech, style: const TextStyle(fontSize: 11)),
                        backgroundColor: AppColors.primary.withOpacity(0.1),
                        padding: const EdgeInsets.symmetric(horizontal: 4),
                        materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      ))
                  .toList(),
            ),
            const SizedBox(height: 16),
            const Divider(height: 1),
            const SizedBox(height: 16),
            
            // Actions
            Row(
              children: [
                Expanded(
                  child: AppButton(
                    text: 'Từ chối',
                    onPressed: () => _showRejectDialog(project),
                    backgroundColor: AppColors.error,
                    height: 40,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: AppButton(
                    text: 'Duyệt & Gán Mentor',
                    onPressed: () => _showAssignMentorDialog(project),
                    height: 40,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildInfoChip(IconData icon, String label) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 16, color: AppColors.textSecondary),
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
  
  void _showAssignMentorDialog(Map<String, dynamic> project) {
    int? selectedMentorId;
    
    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setState) => AlertDialog(
          title: const Text('Gán Mentor cho Dự án'),
          content: SizedBox(
            width: double.maxFinite,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Dự án: ${project['title']}',
                  style: AppTextStyles.subtitle1,
                ),
                const SizedBox(height: 16),
                Text('Chọn Mentor:', style: AppTextStyles.body2),
                const SizedBox(height: 12),
                ..._availableMentors.map((mentor) {
                  final isSelected = selectedMentorId == mentor['id'];
                  return RadioListTile<int>(
                    value: mentor['id'],
                    groupValue: selectedMentorId,
                    onChanged: (value) => setState(() => selectedMentorId = value),
                    title: Text(mentor['name']),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Chuyên môn: ${(mentor['expertise'] as List).join(', ')}'),
                        Text('Dự án: ${mentor['currentProjects']}/${mentor['maxProjects']} • ⭐ ${mentor['rating']}'),
                      ],
                    ),
                    contentPadding: EdgeInsets.zero,
                    dense: true,
                  );
                }),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Hủy'),
            ),
            ElevatedButton(
              onPressed: selectedMentorId == null
                  ? null
                  : () {
                      // TODO: Call API
                      Navigator.pop(context);
                      _showSuccessSnackBar('Đã phê duyệt dự án và gán Mentor thành công');
                      this.setState(() {
                        _pendingProjects.removeWhere((p) => p['id'] == project['id']);
                      });
                    },
              child: const Text('Xác nhận'),
            ),
          ],
        ),
      ),
    );
  }
  
  void _showRejectDialog(Map<String, dynamic> project) {
    final reasonController = TextEditingController();
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Từ chối Dự án'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Lý do từ chối dự án "${project['title']}"'),
            const SizedBox(height: 16),
            TextField(
              controller: reasonController,
              decoration: const InputDecoration(
                labelText: 'Lý do *',
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Hủy'),
          ),
          ElevatedButton(
            onPressed: () {
              if (reasonController.text.trim().isEmpty) return;
              // TODO: Call API
              Navigator.pop(context);
              _showSuccessSnackBar('Đã từ chối dự án');
              setState(() {
                _pendingProjects.removeWhere((p) => p['id'] == project['id']);
              });
            },
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
            child: const Text('Từ chối'),
          ),
        ],
      ),
    );
  }
  
  void _showSuccessSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), backgroundColor: AppColors.success),
    );
  }
}
