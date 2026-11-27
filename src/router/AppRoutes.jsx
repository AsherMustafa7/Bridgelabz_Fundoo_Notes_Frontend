import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import PublicOnlyRoute from '../components/PublicOnlyRoute';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

// Placeholder until dashboard and subsequent features are built
const DashboardPlaceholder = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h2>Fundoo Notes Dashboard</h2>
    <p>Authentication successful!</p>
  </div>
);

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Only routes */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPlaceholder />} />
      </Route>

      {/* Default and Fallback */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
