// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/Auth/LoginPage';
import BranchesPage from './pages/Branches/BranchesPage';
import RolesPage from './pages/Roles/RolesPage';
import UsersPage from './pages/Users/UsersPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import { AuthProvider } from './contexts/AuthContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div dir="rtl">
          <Toaster position="bottom-center" />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/branches" element={<BranchesPage />} />
                  <Route path="/roles" element={<RolesPage />} />
                  <Route path="/users" element={<UsersPage />} />
                </Route>
              </Route>
              <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
          </BrowserRouter>
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
