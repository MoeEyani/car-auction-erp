// src/services/auth.ts
import apiClient from './api';
import type { LoginCredentials, LoginResponse, User } from '../types';

const TOKEN_KEY = 'access_token';
const USER_KEY = 'user';

export const authService = {
  // Login user
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    
    // Store token and user data
    localStorage.setItem(TOKEN_KEY, response.data.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
    
    // Set default authorization header
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
    
    return response.data;
  },

  // Logout user
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    delete apiClient.defaults.headers.common['Authorization'];
  },

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Get stored user
  getUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  },

  // Initialize auth state (call on app startup)
  initializeAuth(): void {
    const token = this.getToken();
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  },

  // Get user permissions
  getUserPermissions(): string[] {
    const user = this.getUser();
    if (!user || !user.role || !user.role.permissions) {
      return [];
    }
    
    return user.role.permissions.map(rp => rp.permission.name);
  },

  // Check if user has specific permission
  hasPermission(permission: string): boolean {
    const permissions = this.getUserPermissions();
    return permissions.includes(permission);
  },

  // Check if user has any of the specified permissions
  hasAnyPermission(permissions: string[]): boolean {
    const userPermissions = this.getUserPermissions();
    return permissions.some(permission => userPermissions.includes(permission));
  },

  // Check if user has all specified permissions
  hasAllPermissions(permissions: string[]): boolean {
    const userPermissions = this.getUserPermissions();
    return permissions.every(permission => userPermissions.includes(permission));
  }
};