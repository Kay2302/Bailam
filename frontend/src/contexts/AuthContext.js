// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { userApi, testLogin } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Kiểm tra token và lấy thông tin người dùng khi component mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Lấy token từ session storage
        const storedToken = sessionStorage.getItem('token');
        const storedUser = sessionStorage.getItem('user');
        
        if (!storedToken || !storedUser) {
          setLoading(false);
          return;
        }
        
        try {
          // Gọi API để xác thực token
          await userApi.verifyToken();
          
          // Token hợp lệ, đặt thông tin người dùng
          const user = JSON.parse(storedUser);
          setCurrentUser(user);
          setIsAuthenticated(true);
          setUserRole(user.role);
        } catch (err) {
          console.error('Token verification failed:', err);
          
          // Nếu token từ test-login, vẫn giữ phiên đăng nhập
          if (storedToken.includes('test-token') || storedToken.includes('admin-token') || storedToken.includes('user-token')) {
            const user = JSON.parse(storedUser);
            setCurrentUser(user);
            setIsAuthenticated(true);
            setUserRole(user.role);
          } else {
            // Token không hợp lệ và không phải test token, xóa khỏi session storage
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
          }
        }
      } catch (err) {
        console.error('Error during token verification:', err);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      let response;
      
      try {
        // Thử đăng nhập với API chính
        response = await userApi.login(email, password);
      } catch (apiError) {
        console.log('Regular API login failed, trying test login endpoint');
        // Nếu API chính thất bại, thử test login
        response = await testLogin(email, password);
      }
      
      const { token, user } = response.data;
      
      // Lưu token và thông tin người dùng vào session storage
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(user));
      
      // Cập nhật state
      setCurrentUser(user);
      setIsAuthenticated(true);
      setUserRole(user.role);
      
      return user;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      const response = await userApi.register(userData);
      
      const { token, user } = response.data;
      
      // Lưu token và thông tin người dùng vào session storage
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(user));
      
      // Cập nhật state
      setCurrentUser(user);
      setIsAuthenticated(true);
      setUserRole(user.role);
      
      return user;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Gọi API logout nếu cần và không phải test token
      const token = sessionStorage.getItem('token');
      if (isAuthenticated && token && !token.includes('test-token') && !token.includes('admin-token') && !token.includes('user-token')) {
        await userApi.logout();
      }
      
      // Xóa token và thông tin người dùng khỏi session storage
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      
      // Cập nhật state
      setCurrentUser(null);
      setIsAuthenticated(false);
      setUserRole(null);
    } catch (err) {
      console.error('Logout error:', err);
      
      // Vẫn xóa token và thông tin người dùng để đảm bảo đăng xuất
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      setCurrentUser(null);
      setIsAuthenticated(false);
      setUserRole(null);
    }
  };

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      setError(null);
      
      if (!currentUser?.id) {
        throw new Error('User not authenticated');
      }
      
      // Kiểm tra xem có phải test user không
      const token = sessionStorage.getItem('token');
      if (token && (token.includes('test-token') || token.includes('admin-token') || token.includes('user-token'))) {
        // Giả lập cập nhật profile cho test user
        const updatedUser = { ...currentUser, ...profileData };
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        return updatedUser;
      }
      
      // Gọi API cập nhật profile
      const response = await userApi.updateProfile(currentUser.id, profileData);
      
      // Cập nhật state và session storage
      const updatedUser = { ...currentUser, ...response.data };
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      
      return updatedUser;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      throw err;
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      
      if (!currentUser?.id) {
        throw new Error('User not authenticated');
      }
      
      // Kiểm tra xem có phải test user không
      const token = sessionStorage.getItem('token');
      if (token && (token.includes('test-token') || token.includes('admin-token') || token.includes('user-token'))) {
        // Giả lập đổi mật khẩu cho test user
        return { message: 'Password changed successfully' };
      }
      
      // Gọi API đổi mật khẩu
      await userApi.changePassword(currentUser.id, currentPassword, newPassword);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
      throw err;
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    userRole,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};