// src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

// ✅ Helper: Check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() >= exp;
  } catch (e) {
    return true;
  }
};

const ProtectedRoute = ({ requiredRole }) => {
  const { user, token } = useSelector((s) => s.auth);

  // ✅ If no user or token expired → redirect to login
  if (!user || !token || isTokenExpired(token)) {
    // ✅ Clear storage if token expired
    if (token && isTokenExpired(token)) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    return <Navigate to="/login" replace />;
  }

  // ✅ If role required and user doesn't match → redirect to home
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;