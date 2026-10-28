import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';

// Navigation & Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BusinessSidebar from './components/BusinessSidebar';
import BusinessHeader from './components/BusinessHeader';
import LoadingSpinner from './components/LoadingSpinner';

// Customer & Public Pages
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import BusinessDetailPage from './pages/BusinessDetailPage';
import LiveTokenPage from './pages/LiveTokenPage';
import CustomerHistoryPage from './pages/CustomerHistoryPage';
import CustomerLoginPage from './pages/CustomerLoginPage';
import CustomerRegisterPage from './pages/CustomerRegisterPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Business Pages
import BusinessLoginPage from './pages/BusinessLoginPage';
import BusinessRegisterPage from './pages/BusinessRegisterPage';
import BusinessDashboardPage from './pages/business/BusinessDashboardPage';
import BusinessLiveQueuePage from './pages/business/BusinessLiveQueuePage';
import BusinessManageQueuesPage from './pages/business/BusinessManageQueuesPage';
import BusinessProfilePage from './pages/business/BusinessProfilePage';

// Public & Customer Layout wrapper
const CustomerLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FBF8F2] text-[#231522] dark:bg-[#170E16] dark:text-[#FAF6F0] transition-colors selection:bg-[#C3532B] selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Business Console Layout wrapper
const BusinessLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-[#FBF8F2] text-[#231522] dark:bg-[#170E16] dark:text-[#FAF6F0] transition-colors selection:bg-[#C3532B] selection:text-white">
      <BusinessSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <BusinessHeader />
        <main className="flex-1 pb-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Protected Route Guard
const ProtectedRoute = ({ requiredRole, children }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner text="Authenticating session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={requiredRole === 'business' ? '/business/login' : '/login'}
        replace
      />
    );
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <Navigate
        to={user?.role === 'business' ? '/business/dashboard' : '/explore'}
        replace
      />
    );
  }

  return children || <Outlet />;
};

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          className:
            '!rounded-xl !bg-slate-900 !text-white dark:!bg-slate-800 dark:!text-white !text-xs !font-medium !shadow-xl !border !border-slate-800',
        }}
      />

      <Routes>
        {/* Customer & Public Site Routes */}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/business/:id" element={<BusinessDetailPage />} />
          <Route path="/token/:id" element={<LiveTokenPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<CustomerLoginPage />} />
          <Route path="/register" element={<CustomerRegisterPage />} />
          <Route path="/business/login" element={<BusinessLoginPage />} />
          <Route path="/business/register" element={<BusinessRegisterPage />} />

          {/* Customer Authenticated Routes */}
          <Route
            path="/my-queues"
            element={
              <ProtectedRoute requiredRole="customer">
                <CustomerHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute requiredRole="customer">
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* 404 Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Business Console Authenticated Routes */}
        <Route
          path="/business"
          element={
            <ProtectedRoute requiredRole="business">
              <BusinessLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/business/dashboard" replace />} />
          <Route path="dashboard" element={<BusinessDashboardPage />} />
          <Route path="queues" element={<BusinessLiveQueuePage />} />
          <Route path="manage-queues" element={<BusinessManageQueuesPage />} />
          <Route path="profile" element={<BusinessProfilePage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
