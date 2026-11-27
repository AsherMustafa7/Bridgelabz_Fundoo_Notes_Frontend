import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../utils/token';

export const PublicOnlyRoute = () => {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
};

export default PublicOnlyRoute;
