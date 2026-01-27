import 'package:flutter/material.dart';
import 'package:labodc_mobile/core/theme/app_colors.dart';
import 'package:labodc_mobile/core/theme/app_text_styles.dart';
import 'package:labodc_mobile/widgets/common_widgets.dart';
import 'package:labodc_mobile/widgets/app_button.dart';

class BrowseProjectsScreen extends StatefulWidget {
  const BrowseProjectsScreen({super.key});

  @override
  State<BrowseProjectsScreen> createState() => _BrowseProjectsScreenState();
}

class _BrowseProjectsScreenState extends State<BrowseProjectsScreen> {
  String _selectedTech = 'ALL';
  String _sortBy = 'newest';
  
  final List<String> _technologies = [
    'ALL',
    'ReactJS',
    'NodeJS',
    'MongoDB',
    'Python',
    'Java',
    'Flutter',
  ];

  final List<Map<String, dynamic>> _projects = [
    {
      'id': 789,
      'title': 'Website Quản lý Bán hàng',
      'company': 'ABC Technology',
      'companyLogo': 'https://ui-avatars.com/api/?name=ABC+Technology',
      'description': 'Xây dựng website quản lý bán hàng online với các tính năng: quản lý sản phẩm, đơn hàng, khách hàng, báo cáo doanh thu.',
      'technologies': ['ReactJS', 'NodeJS', 'MongoDB'],
      'startDate': '2026-02-01',
      'endDate': '2026-05-31',
      'duration': '4 tháng',
      'budget': 100000000,
      'allowancePerStudent': 14000000,
      'numberOfStudents': 5,
      'spotsAvailable': 3,
      'skillRequirements': ['ReactJS (Intermediate)', 'NodeJS (Intermediate)'],
      'status': 'RECRUITING',
    },
    {
      'id': 790,
      'title': 'Mobile App Quản lý Tài chính',
      'company': 'FinTech Solutions',
      'companyLogo': 'https://ui-avatars.com/api/?name=FinTech+Solutions',
      'description': 'Ứng dụng mobile giúp người dùng quản lý chi tiêu, lập kế hoạch tài chính cá nhân, đầu tư và tiết kiệm.',
      'technologies': ['Flutter', 'Python', 'PostgreSQL'],
      'startDate': '2026-02-15',
      'endDate': '2026-06-30',
      'duration': '4.5 tháng',
      'budget': 120000000,
      'allowancePerStudent': 16000000,
      'numberOfStudents': 6,
      'spotsAvailable': 4,
      'skillRequirements': ['Flutter (Intermediate)', 'Python (Beginner)'],
      'status': 'RECRUITING',
    },
    {
      'id': 791,
      'title': 'Hệ thống CRM cho Doanh nghiệp',
      'company': 'Enterprise Systems Co.',
      'companyLogo': 'https://ui-avatars.com/api/?name=Enterprise+Systems',
      'description': 'Hệ thống quản lý quan hệ khách hàng (CRM) với các module: lead management, sales pipeline, customer service.',
      'technologies': ['ReactJS', 'Java', 'MySQL'],
      'startDate': '2026-03-01',
      'endDate': '2026-07-31',
      'duration': '5 tháng',
      'budget': 150000000,
      'allowancePerStudent': 18000000,
      'numberOfStudents': 7,
      'spotsAvailable': 2,
      'skillRequirements': ['ReactJS (Advanced)', 'Java Spring Boot (Intermediate)'],
      'status': 'RECRUITING',
    },
  ];

  List<Map<String, dynamic>> get _filteredProjects {
    var filtered = _projects.where((p) => p['status'] == 'RECRUITING').toList();
    
    if (_selectedTech != 'ALL') {
      filtered = filtered.where((p) {
        final techs = p['technologies'] as List<String>;
        return techs.contains(_selectedTech);
      }).toList();
    }

    if (_sortBy == 'newest') {
      filtered.sort((a, b) => b['id'].compareTo(a['id']));
    } else if (_sortBy == 'budget') {
      filtered.sort((a, b) => b['budget'].compareTo(a['budget']));
    } else if (_sortBy == 'deadline') {
      filtered.sort((a, b) => a['endDate'].compareTo(b['endDate']));
    }

    return filtered;
  }

  void _showJoinDialog(Map<String, dynamic> project) {
    final messageController = TextEditingController();
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Đăng ký tham gia dự án'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              project['title'],
              style: AppTextStyles.subtitle1.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: messageController,
              decoration: const InputDecoration(
                labelText: 'Lời nhắn đến Mentor (tùy chọn)',
                hintText: 'Chia sẻ lý do bạn muốn tham gia dự án này...',
                border: OutlineInputBorder(),
              ),
              maxLines: 4,
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
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Đã gửi yêu cầu tham gia dự án'),
                  backgroundColor: AppColors.success,
                ),
              );
            },
            child: const Text('Gửi yêu cầu'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Duyệt Dự án'),
        actions: [
          PopupMenuButton<String>(
            icon: const Icon(Icons.sort),
            onSelected: (value) => setState(() => _sortBy = value),
            itemBuilder: (context) => [
              const PopupMenuItem(value: 'newest', child: Text('Mới nhất')),
              const PopupMenuItem(value: 'budget', child: Text('Ngân sách cao')),
              const PopupMenuItem(value: 'deadline', child: Text('Hạn chót gần')),
            ],
          ),
        ],
      ),
      body: Column(
        children: [
          // Technology filter
          Container(
            height: 50,
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _technologies.length,
              itemBuilder: (context, index) {
                final tech = _technologies[index];
                final isSelected = tech == _selectedTech;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: FilterChip(
                    label: Text(tech),
                    selected: isSelected,
                    onSelected: (selected) {
                      setState(() => _selectedTech = tech);
                    },
                    backgroundColor: AppColors.white,
                    selectedColor: AppColors.primary.withOpacity(0.2),
                    checkmarkColor: AppColors.primary,
                    labelStyle: TextStyle(
                      color: isSelected ? AppColors.primary : AppColors.textPrimary,
                      fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                    ),
                  ),
                );
              },
            ),
          ),

          // Projects list
          Expanded(
            child: _filteredProjects.isEmpty
                ? const Center(
                    child: EmptyState(
                      icon: Icons.search_off,
                      message: 'Không tìm thấy dự án phù hợp',
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _filteredProjects.length,
                    itemBuilder: (context, index) {
                      final project = _filteredProjects[index];
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 16),
                        child: _buildProjectCard(project),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildProjectCard(Map<String, dynamic> project) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.05),
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(12),
                topRight: Radius.circular(12),
              ),
            ),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 24,
                  backgroundColor: AppColors.primary.withOpacity(0.1),
                  child: Text(
                    project['company'][0],
                    style: AppTextStyles.subtitle1.copyWith(
                      color: AppColors.primary,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        project['title'],
                        style: AppTextStyles.subtitle1.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        project['company'],
                        style: AppTextStyles.caption.copyWith(
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: AppColors.success.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.people, size: 14, color: AppColors.success),
                      const SizedBox(width: 4),
                      Text(
                        '${project['spotsAvailable']} chỗ',
                        style: AppTextStyles.caption.copyWith(
                          color: AppColors.success,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Content
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  project['description'],
                  style: AppTextStyles.body2.copyWith(
                    color: AppColors.textSecondary,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 12),

                // Technologies
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: (project['technologies'] as List<String>).map((tech) {
                    return Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: AppColors.info.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        tech,
                        style: AppTextStyles.caption.copyWith(
                          color: AppColors.info,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    );
                  }).toList(),
                ),

                const SizedBox(height: 16),

                // Details
                Row(
                  children: [
                    Expanded(
                      child: _buildInfoItem(
                        Icons.calendar_today,
                        'Thời gian',
                        project['duration'],
                      ),
                    ),
                    Expanded(
                      child: _buildInfoItem(
                        Icons.attach_money,
                        'Phụ cấp',
                        '${(project['allowancePerStudent'] / 1000000).toStringAsFixed(0)}M',
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(
                      child: _buildInfoItem(
                        Icons.people,
                        'Đội ngũ',
                        '${project['numberOfStudents']} sinh viên',
                      ),
                    ),
                    Expanded(
                      child: _buildInfoItem(
                        Icons.event,
                        'Bắt đầu',
                        project['startDate'],
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 16),

                // Join button
                SizedBox(
                  width: double.infinity,
                  child: AppButton(
                    text: 'Đăng ký tham gia',
                    onPressed: () => _showJoinDialog(project),
                    icon: Icons.arrow_forward,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoItem(IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, size: 16, color: AppColors.textSecondary),
        const SizedBox(width: 4),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: AppTextStyles.caption.copyWith(
                color: AppColors.textSecondary,
                fontSize: 10,
              ),
            ),
            Text(
              value,
              style: AppTextStyles.caption.copyWith(
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ],
    );
  }
}
