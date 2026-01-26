import 'package:flutter/material.dart';
import 'package:labodc_mobile/core/theme/app_colors.dart';
import 'package:labodc_mobile/core/theme/app_text_styles.dart';
import 'package:labodc_mobile/widgets/common_widgets.dart';
import 'package:labodc_mobile/widgets/app_button.dart';

class EnterpriseManagementScreen extends StatefulWidget {
  const EnterpriseManagementScreen({super.key});

  @override
  State<EnterpriseManagementScreen> createState() => _EnterpriseManagementScreenState();
}

class _EnterpriseManagementScreenState extends State<EnterpriseManagementScreen> {
  String _selectedTab = 'pending';
  
  // Mock data - sẽ được thay bằng API call
  final List<Map<String, dynamic>> _pendingEnterprises = [
    {
      'id': 123,
      'companyName': 'ABC Technology Co., Ltd',
      'taxCode': '0123456789',
      'representative': 'Nguyễn Văn A',
      'email': 'company@abctech.vn',
      'phone': '0901234567',
      'industry': 'Công nghệ thông tin',
      'registeredAt': '2026-01-10',
      'status': 'PENDING',
    },
    {
      'id': 124,
      'companyName': 'XYZ Corporation',
      'taxCode': '0987654321',
      'representative': 'Trần Thị B',
      'email': 'info@xyzcorp.vn',
      'phone': '0912345678',
      'industry': 'Thương mại điện tử',
      'registeredAt': '2026-01-12',
      'status': 'PENDING',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Quản lý Doanh nghiệp'),
      ),
      body: Column(
        children: [
          // Tab Bar
          Container(
            color: AppColors.white,
            child: Row(
              children: [
                _buildTab('Chờ duyệt', 'pending', _pendingEnterprises.length),
                _buildTab('Đã duyệt', 'approved', 0),
                _buildTab('Đã từ chối', 'rejected', 0),
              ],
            ),
          ),
          const Divider(height: 1),
          
          // Content
          Expanded(
            child: _selectedTab == 'pending' && _pendingEnterprises.isNotEmpty
                ? _buildPendingList()
                : const Center(
                    child: EmptyState(
                      icon: Icons.business,
                      message: 'Không có doanh nghiệp nào',
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
      itemCount: _pendingEnterprises.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final enterprise = _pendingEnterprises[index];
        return _buildEnterpriseCard(enterprise);
      },
    );
  }
  
  Widget _buildEnterpriseCard(Map<String, dynamic> enterprise) {
    return AppCard(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(
                    Icons.business,
                    color: AppColors.primary,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        enterprise['companyName'],
                        style: AppTextStyles.subtitle1,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'MST: ${enterprise['taxCode']}',
                        style: AppTextStyles.caption.copyWith(
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
                StatusBadge(
                  label: 'Chờ duyệt',
                  color: AppColors.warning,
                ),
              ],
            ),
            const SizedBox(height: 16),
            const Divider(height: 1),
            const SizedBox(height: 16),
            
            // Info
            _buildInfoRow(Icons.person, 'Người đại diện', enterprise['representative']),
            const SizedBox(height: 8),
            _buildInfoRow(Icons.email, 'Email', enterprise['email']),
            const SizedBox(height: 8),
            _buildInfoRow(Icons.phone, 'Điện thoại', enterprise['phone']),
            const SizedBox(height: 8),
            _buildInfoRow(Icons.category, 'Ngành nghề', enterprise['industry']),
            const SizedBox(height: 8),
            _buildInfoRow(Icons.calendar_today, 'Ngày đăng ký', enterprise['registeredAt']),
            
            const SizedBox(height: 16),
            const Divider(height: 1),
            const SizedBox(height: 16),
            
            // Actions
            Row(
              children: [
                Expanded(
                  child: AppButton(
                    text: 'Từ chối',
                    onPressed: () => _showRejectDialog(enterprise),
                    backgroundColor: AppColors.error,
                    height: 40,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: AppButton(
                    text: 'Phê duyệt',
                    onPressed: () => _showApproveDialog(enterprise),
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
  
  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 16, color: AppColors.textSecondary),
        const SizedBox(width: 8),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: AppTextStyles.caption.copyWith(
                  color: AppColors.textSecondary,
                ),
              ),
              Text(value, style: AppTextStyles.body2),
            ],
          ),
        ),
      ],
    );
  }
  
  void _showApproveDialog(Map<String, dynamic> enterprise) {
    final noteController = TextEditingController();
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Phê duyệt Doanh nghiệp'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Bạn có chắc chắn muốn phê duyệt doanh nghiệp "${enterprise['companyName']}"?',
              style: AppTextStyles.body2,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: noteController,
              decoration: const InputDecoration(
                labelText: 'Ghi chú (tùy chọn)',
                hintText: 'Nhập ghi chú nếu cần...',
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
              // TODO: Call API to approve
              Navigator.pop(context);
              _showSuccessSnackBar('Đã phê duyệt doanh nghiệp thành công');
              setState(() {
                _pendingEnterprises.removeWhere((e) => e['id'] == enterprise['id']);
              });
            },
            child: const Text('Phê duyệt'),
          ),
        ],
      ),
    );
  }
  
  void _showRejectDialog(Map<String, dynamic> enterprise) {
    final reasonController = TextEditingController();
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Từ chối Doanh nghiệp'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Vui lòng nhập lý do từ chối doanh nghiệp "${enterprise['companyName']}"',
              style: AppTextStyles.body2,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: reasonController,
              decoration: const InputDecoration(
                labelText: 'Lý do từ chối *',
                hintText: 'VD: Mã số thuế không hợp lệ',
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
              if (reasonController.text.trim().isEmpty) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Vui lòng nhập lý do từ chối')),
                );
                return;
              }
              // TODO: Call API to reject
              Navigator.pop(context);
              _showSuccessSnackBar('Đã từ chối doanh nghiệp');
              setState(() {
                _pendingEnterprises.removeWhere((e) => e['id'] == enterprise['id']);
              });
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.error,
            ),
            child: const Text('Từ chối'),
          ),
        ],
      ),
    );
  }
  
  void _showSuccessSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: AppColors.success,
      ),
    );
  }
}
