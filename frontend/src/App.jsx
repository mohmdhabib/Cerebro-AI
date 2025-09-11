// frontend/src/App.jsx

import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import Layout from "./components/shared/Layout";
import Spinner from "./components/shared/Spinner";

// Correctly import pages from the /pages directory
import Dashboard from "./pages/Dashboard";
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignupForm";
import UploadPage from "./pages/UploadPage";
import AllReportsPage from "./pages/AllReportsPage";
import PatientHistoryPage from "./pages/PatientHistoryPage";
import SettingsPage from "./pages/SettingsPage";

// This component wraps all private routes, applying the main layout and checking for auth
const PrivateRoutes = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Spinner size="lg" />
      </div>
    );
  }
  return user ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to="/login" replace />
  );
};

function App() {
  const { profile } = useAuth();

  return (
    <Routes>
      {/* Public Routes (no layout) */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignUpForm />} />

      {/* Private Routes (wrapped in Layout) */}
      <Route element={<PrivateRoutes />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* Patient-Specific Routes */}
        {profile?.role === "Patient" && (
          <>
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/history" element={<PatientHistoryPage />} />
          </>
        )}

        {/* Doctor-Specific Route - THE FIX IS HERE */}
        {profile?.role === "Doctor" && (
          <Route path="/reports" element={<AllReportsPage />} />
        )}
      </Route>

      {/* Fallback for any other path */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
