// src/components/PrivateRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function PrivateRoute({ children, requireAdmin = false }) {
  const location = useLocation();
  const { isAuthenticated, userRole, loading } = useAuth();
  
  // Đang tải thông tin người dùng
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }
  
  // Nếu yêu cầu quyền admin và người dùng không phải admin
  if (requireAdmin && userRole !== 'admin') {
    return <Navigate to="/login" state={{ returnUrl: location.pathname }} replace />;
  }
  
  // Nếu yêu cầu đăng nhập và người dùng chưa đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ returnUrl: location.pathname }} replace />;
  }
  
  return children;
}

export default PrivateRoute;