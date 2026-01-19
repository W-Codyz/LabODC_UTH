// Axios Configuration
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_BASE_URL, API_TIMEOUT, STORAGE_KEYS } from '@/utils/constants';
import { IApiResponse, IApiError } from '@/types/api.types';

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: any) => {
    // Add access token to request headers
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add timestamp to request
    config.metadata = { startTime: new Date().getTime() };
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<IApiResponse>) => {
    // Calculate request duration
    const duration = new Date().getTime() - response.config.metadata.startTime;
    console.log(`Request to ${response.config.url} took ${duration}ms`);
    
    return response;
  },
  async (error: AxiosError<IApiError>) => {
    const originalRequest: any = error.config;
    
    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        
        if (refreshToken) {
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            { refreshToken }
          );
          
          // Backend returns 'token' not 'accessToken'
          const { token } = response.data.data;
          
          // Save new access token
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token failed - logout user
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_INFO);
        
        // Redirect to login
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other errors
    const errorResponse: IApiError = {
      success: false,
      message: error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại!',
      errors: error.response?.data?.errors,
      timestamp: new Date().toISOString(),
    };
    
    return Promise.reject(errorResponse);
  }
);

export default axiosInstance;
