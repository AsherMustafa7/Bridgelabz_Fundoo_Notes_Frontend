import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import PublicOnlyRoute from '../components/PublicOnlyRoute';
import DashboardLayout from '../components/DashboardLayout';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

// Temporary placeholder for dashboard view until Feature 5
const DashboardPlaceholder = () => (
  <div style={{ padding: '2rem' }}>
    <h2>Welcome to Fundoo Notes</h2>
    <p style={{ marginTop: '8px', color: '#5f6368' }}>
      Select an option from the sidebar or start organizing your ideas.
    </p>
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

      {/* Protected routes wrapped in DashboardLayout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPlaceholder />} />
          <Route path="/reminders" element={<DashboardPlaceholder />} />
          <Route path="/archive" element={<DashboardPlaceholder />} />
          <Route path="/trash" element={<DashboardPlaceholder />} />
          <Route path="/batch-import" element={<DashboardPlaceholder />} />
        </Route>
      </Route>

      {/* Default and Fallback */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
