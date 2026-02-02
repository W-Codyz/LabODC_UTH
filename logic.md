# Ghi chú logic tổng thể (Mobile)

## 1. Bức tranh kiến trúc

- **Backend hiện có**: Auth-service (login/register/validate), User-service (`/users/me` GET/PUT), Project-service (create/approve/join/my/detail). Phase 3 trở đi mới bổ sung Task/Payment/Fund/Report/Notification.
- **Mobile**: Flutter + Provider. Các service chính (`ApiService`, `AuthService`, `ProjectService`, `ProfileService`) nói chuyện qua API Gateway. UI chia vai trò (Enterprise, Talent, Mentor, Lab/System Admin).
- **Trạng thái hiện tại**: UI hầu hết dùng mock data. Auth + `/users/me` là hai luồng đã thực thi. ProjectService vừa được tạo để gom tất cả API dự án, có fallback mock.

## 2. Luồng dữ liệu mục tiêu

```
              +-------------------+
              |   API Gateway     |
              +-------------------+
                 ^        ^
                 |        |
          +----------+        +-----------+
          |                               |
    AuthService/ProfileService     ProjectService (future Task/Payment/...)
          |                               |
    AuthProvider                   ProjectProvider (kế hoạch mở rộng Task/Fund Provider)
          |                               |
    AppRouter + UI            Enterprise/Talent/Mentor screens
```

- Mọi luồng sẽ đi từ UI → Provider → Service → Gateway. Provider chịu trách nhiệm caching, loading, error, filter để UI càng “mỏng” càng tốt.
- Killer feature: khi backend mở thêm endpoint, chỉ cần cập nhật Service + (nếu cần) Provider; các màn hình nghe theo Notify nên không sửa nhiều.

## 3. Phân rã theo vai trò

1. **Enterprise**

- Thấy toàn bộ dự án mình tạo, phân loại theo trạng thái, xem chi tiết/tiến độ, tải báo cáo.
- Luồng: `EnterpriseProjectListScreen → ProjectProvider.loadEnterpriseProjects(userId)`.
- Tiếp theo sẽ cần `ProjectDetailScreen`, `ProposalScreen` dùng chung Provider + Service.

2. **Talent**

- Duyệt tất cả dự án đang tuyển, lọc theo công nghệ, submit đơn tham gia.
- Luồng mục tiêu: `BrowseProjectsScreen → ProjectProvider.loadProjects()` kết hợp filter client-side (vì API filter chưa có). Khi backend hỗ trợ `GET /projects?tech=...`, Provider sẽ truyền query params.
- Sau khi join, Talent thấy dự án của mình (`ProjectProvider` sẽ có `loadMyProjects`).
- **Luồng gửi yêu cầu tham gia**: `BrowseProjectsScreen` mở dialog để talent nhập lời nhắn → gọi `ProjectProvider.submitTalentApplication()` → provider gọi `ProjectService.submitTalentApplication()` (POST `/projects/{id}/join`) → khi thành công hiển thị toast và chuẩn bị refresh danh sách. Toàn bộ trạng thái submit (loading/error) nằm ở provider để các màn hình khác có thể tái sử dụng.
- **Luồng "Dự án của tôi"**: Tab "Đang thực hiện" + "Đã hoàn thành" đọc cùng một nguồn dữ liệu từ `ProjectProvider` nhưng ở scope `my`. Provider cần nhớ scope hiện tại để không cache nhầm với danh sách chung. `ProjectService.fetchMyProjects()` sẽ gọi `/projects/my` (hoặc mock) và trả về danh sách đã gắn trạng thái. UI lọc theo `ProjectStatus` để phân active/completed, hỗ trợ kéo để refresh + fallback khi lỗi.

3. **Mentor**

- Thấy dự án được phân, quản lý nhiệm vụ, đánh giá Talent.
- Logic tương tự: Provider fetch danh sách, TaskProvider lo nhiệm vụ khi có API.

4. **Lab/System Admin**

- Quản lý phê duyệt, phân bổ quỹ. Chờ các service Fund/Report. Khi có API, tạo `AdminService` + Provider mới.

## 4. Logic cụ thể từng lớp

- `ProjectService`
  - Hàm `fetchProjects`, `fetchEnterpriseProjects`, `fetchProjectMembers`, `leaveProject`.
  - Fallback mock giúp UI có dữ liệu demo.
  - Bổ sung `fetchMyProjects({ProjectStatus? status})` ánh xạ `/projects/my` để phục vụ Talent/Mentor. Khi backend chưa có, fallback lọc từ mock list.
- `ProjectProvider`
  - Lưu `_projects`, `_isLoading`, `_currentFilter`, `_error`.
  - API chính: `loadProjects`, `loadEnterpriseProjects`, `refresh`, `setFilter`, `countByStatus`, `availableTechnologies` (kế hoạch mới), `ensureLoaded` (tránh gọi API lại nếu đã có).
  - Đã mở rộng `ProjectDataScope` (all / enterprise / my) để cache chính xác theo ngữ cảnh, đồng thời gom logic submit đơn tham gia (loading/error) cho toàn app.
  - Thêm trạng thái `isSubmittingApplication`, `submittingProjectId`, `isLeavingProject`, `leavingProjectId` để mọi hành động async có thể disable đúng nút trên UI.
  - Các helper `activeTalentProjects` và `completedTalentProjects` hiện phục vụ trực tiếp cho UI “Dự án của tôi”, đảm bảo Tab chỉ đọc dữ liệu từ Provider thay vì mock cục bộ.
  - Hàm `leaveProject(projectId)` dùng `ProjectService.leaveProject()`, sau khi thành công gọi `refresh()` để đồng bộ danh sách đúng scope (ưu tiên scope `my`).
- `AuthProvider`
  - Chỉ quản lý token/user role. Các provider khác không nên truy cập storage trực tiếp.

## 5. Kịch bản logic chính

1. **Enterprise Dashboard**

- Khi vào màn hình, Provider được inject trong `main.dart` ⇒ nếu user role = Enterprise, gọi `loadEnterpriseProjects(userId)`.
- Tabs = các `ProjectStatus` chính, hiển thị count `countByStatus`.
- Refresh kéo xuống = gọi lại `refresh(enterpriseId: userId)`.

2. **Talent Browse Projects** (đã gắn provider + join)

- Khi vào lần đầu, `BrowseProjectsScreen` gọi `ProjectProvider.ensureLoaded(scope: general)` nên chỉ gọi API khi cache rỗng.
- UI filter theo công nghệ (`availableTechnologies`) và sort (Mới nhất/Ngân sách/Hạn chót) hoàn toàn client-side cho tới khi backend có query.
- Nút “Đăng ký” mở dialog nhập lời nhắn, dialog theo dõi `isSubmittingApplication` + `submittingProjectId` từ provider để disable nút và hiển thị loader.
- Provider gọi `submitTalentApplication()` (POST `/projects/{id}/join` hoặc mock) và tự refresh danh sách, SnackBar phản hồi dựa trên kết quả.

3. **Talent My Projects** (đã refactor UI)

- `MyProjectsScreen` khởi tạo `ProjectProvider.ensureLoaded(scope: my)` ngay sau frame đầu tiên, đảm bảo dữ liệu cá nhân được cache tách biệt với danh sách chung.
- Tab "Đang thực hiện" đọc `activeTalentProjects`, Tab "Đã hoàn thành" đọc `completedTalentProjects`; cả hai cùng chia sẻ `RefreshIndicator` để gọi `loadMyProjects()`.
- Trạng thái tải/lỗi/empty dùng chung một builder: loading hiển thị `CircularProgressIndicator`, lỗi dùng `EmptyState` với thông điệp từ provider, empty hiển thị thông báo thân thiện.
- Card "Đang thực hiện" render tiến độ (LinearProgressIndicator dựa trên start/end date, badge trạng thái, công nghệ), card "Đã hoàn thành" hiển thị mô tả, ngân sách, phân bổ quỹ và kỹ năng yêu cầu.

4. **Talent hậu-join** (mới)

- Mỗi card trong tab "Đang thực hiện" hiển thị cụm nút: "Xem chi tiết" (outlined) mở bottom sheet, "Rời dự án" (màu cảnh báo) gọi `ProjectProvider.leaveProject()` sau khi người dùng xác nhận.
- Bottom sheet tái sử dụng dữ liệu `ProjectModel`: mô tả đầy đủ, mục tiêu, tiến độ, lịch timeline, phân bổ ngân sách (team/mentor/lab) và danh sách kỹ năng để Talent theo dõi.
- Khi `leaveProject()` thành công, provider tự `refresh()` với scope `my`, `RefreshIndicator` + danh sách cập nhật ngay (đảm bảo `ProjectProvider.refresh()` đồng bộ). UI hiển thị SnackBar kết quả.
- Tab "Đã hoàn thành" vẫn có nút "Xem chi tiết" nhằm xem lại tài liệu, nhưng ẩn thao tác rời dự án.

4. **Profile Flow**

- Mọi màn hình profile nên dùng `ProfileService.fetchCurrentUser()`; sau khi edit → `updateProfile`.

5. **Task/Payment (tương lai)**

- Khi có API, tạo thêm `TaskService`, `TaskProvider`, `PaymentService`, ... dựa trên khuôn `ProjectService`.

## 6. Lộ trình thực thi

1. (Đã xong) Gom service + provider cho Project, refactor Enterprise Project List.
2. (Đã xong) Dựa trên provider đó để biến `BrowseProjectsScreen` thành UI động **và hoàn thiện luồng gửi yêu cầu tham gia (join)** với state submit thống nhất.
3. (Đã xong) Kích hoạt tab "Dự án của tôi" bằng provider scope `my` + API `fetchMyProjects`, refactor `MyProjectsScreen` dùng provider & trạng thái thống nhất.
4. (Đang làm) Hoàn thiện hành động hậu-join: detail bottom sheet + nút rời dự án; đảm bảo gọi `ProjectProvider.leaveProject()` và refresh scope.
5. (Kế tiếp) Sau khi backend task/payment mở API, bổ sung TaskProvider + màn quản lý nhiệm vụ, đồng thời hiện thực hóa dòng tiền Fund.

## 7. Kiểm thử & xác nhận backend

- **Mục tiêu**: đảm bảo `ProjectProvider.refresh()` được kích hoạt sau các hành động join/leave khi kết nối backend thật (API Gateway tại `http://localhost:8080/api`).
- **Quy trình thủ công**: (1) Khởi chạy backend (`mvn spring-boot:run` hoặc `docker compose up` tuỳ môi trường), (2) đăng nhập tài khoản Talent trong app, (3) ở Browse Projects gửi yêu cầu tham gia và quan sát danh sách cập nhật, (4) chuyển sang tab "Dự án của tôi", mở detail và rời dự án, (5) xác nhận dự án biến mất sau khi `refresh()` hoàn tất.
- **Kiểm thử tự động**: file `test/project_provider_post_join_test.dart` dùng `FakeProjectService` mô phỏng backend để khẳng định `leaveProject()` luôn gọi lại `fetchMyProjects()` và cập nhật `_projects`. Chạy `flutter test test/project_provider_post_join_test.dart` trước khi thực hiện kiểm thử thủ công nhằm tránh lỗi logic.
