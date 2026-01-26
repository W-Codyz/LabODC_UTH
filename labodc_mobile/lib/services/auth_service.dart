import 'package:labodc_mobile/core/constants/api_endpoints.dart';
import 'package:labodc_mobile/models/auth_model.dart';
import 'package:labodc_mobile/models/api_response.dart';
import 'package:labodc_mobile/services/api_service.dart';
import 'package:labodc_mobile/services/storage_service.dart';

/// Authentication Service
class AuthService {
  final _api = ApiService();
  final _storage = StorageService();
  
  /// Login user
  Future<LoginResponse> login(String email, String password) async {
    try {
      final request = LoginRequest(email: email, password: password);
      final response = await _api.post(
        ApiEndpoints.login,
        data: request.toJson(),
      );
      
      final loginResponse = LoginResponse.fromJson(response.data);
      
      if (loginResponse.success && loginResponse.data != null) {
        final authData = loginResponse.data!;
        
        // Save tokens (match web portal storage keys)
        await _storage.saveAccessToken(authData.token);
        if (authData.refreshToken != null) {
          await _storage.saveRefreshToken(authData.refreshToken!);
        }
        
        // Save user info
        await _storage.saveUserData({
          'userId': authData.userId,
          'email': authData.email,
          'role': authData.role,
          'status': authData.status,
          'emailVerified': authData.emailVerified,
        });
        await _storage.saveUserRole(authData.role);
      }
      
      return loginResponse;
    } catch (e) {
      rethrow;
    }
  }
  
  /// Register new user
  Future<ApiResponse> register(RegisterRequest request) async {
    try {
      final response = await _api.post(
        ApiEndpoints.register,
        data: request.toJson(),
      );
      
      return ApiResponse.fromJson(response.data, null);
    } catch (e) {
      rethrow;
    }
  }
  
  /// Forgot password
  Future<ApiResponse> forgotPassword(String email) async {
    try {
      final response = await _api.post(
        ApiEndpoints.forgotPassword,
        data: {'email': email},
      );
      
      return ApiResponse.fromJson(response.data, null);
    } catch (e) {
      rethrow;
    }
  }
  
  /// Reset password
  Future<ApiResponse> resetPassword({
    required String token,
    required String otp,
    required String newPassword,
  }) async {
    try {
      final response = await _api.post(
        ApiEndpoints.resetPassword,
        data: {
          'token': token,
          'otp': otp,
          'newPassword': newPassword,
        },
      );
      
      return ApiResponse.fromJson(response.data, null);
    } catch (e) {
      rethrow;
    }
  }
  
  /// Verify email
  Future<ApiResponse> verifyEmail(String token) async {
    try {
      final response = await _api.post(
        ApiEndpoints.verifyEmail,
        data: {'token': token},
      );
      
      return ApiResponse.fromJson(response.data, null);
    } catch (e) {
      rethrow;
    }
  }
  
  /// Logout
  Future<void> logout() async {
    try {
      await _api.post(ApiEndpoints.logout);
    } catch (e) {
      // Continue with local logout even if API fails
    } finally {
      await _storage.clear();
    }
  }
  
  /// Check if user is logged in
  Future<bool> isLoggedIn() async {
    final token = await _storage.getAccessToken();
    return token != null && token.isNotEmpty;
  }
  
  /// Get current user data
  Map<String, dynamic>? getCurrentUser() {
    return _storage.getUserData();
  }
  
  /// Get current user role
  String? getCurrentUserRole() {
    return _storage.getUserRole();
  }
}
