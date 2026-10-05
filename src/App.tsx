import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ReportsProvider } from './context/ReportsContext';

// Public & Citizen Layouts & Pages
import { CitizenLayout } from './components/layout/CitizenLayout';
import { LandingPage } from './pages/public/LandingPage';
import { ReportWastePage } from './pages/citizen/ReportWastePage';
import { WasteMapPage } from './pages/citizen/WasteMapPage';
import { MyReportsPage } from './pages/citizen/MyReportsPage';
import { HighRiskAreasPage } from './pages/citizen/HighRiskAreasPage';
import { AwarenessPage } from './pages/public/AwarenessPage';
import { LoginPage } from './pages/public/LoginPage';
import { CitizenDashboardPage } from './pages/citizen/CitizenDashboardPage';

// Admin Layout & Pages
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminProtectedRoute } from './components/layout/AdminProtectedRoute';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminMapPage } from './pages/admin/AdminMapPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';

export default function App() {
  return (
    <AuthProvider>
      <ReportsProvider>
        <BrowserRouter>
          <Routes>
            {/* Citizen & Public Routes */}
            <Route element={<CitizenLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/report" element={<ReportWastePage />} />
              <Route path="/map" element={<WasteMapPage />} />
              <Route path="/my-reports" element={<MyReportsPage />} />
              <Route path="/dashboard" element={<CitizenDashboardPage />} />
              <Route path="/high-risk" element={<HighRiskAreasPage />} />
              <Route path="/awareness" element={<AwarenessPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Route>

            {/* Admin Console Routes (Protected) */}
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }
            >
              <Route index element={<AdminDashboardPage />} />
              <Route path="reports" element={<AdminReportsPage />} />
              <Route path="map" element={<AdminMapPage />} />
              <Route path="analytics" element={<AdminAnalyticsPage />} />
            </Route>

            {/* Catch-all Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ReportsProvider>
    </AuthProvider>
  );
}
