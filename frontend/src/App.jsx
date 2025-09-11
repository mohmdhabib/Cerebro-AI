import { Routes, Route, Navigate } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import Layout from "./components/shared/Layout";
import Spinner from "./components/shared/Spinner";

// Import Page Components
import Dashboard from "./pages/Dashboard";
import LoginPage from "./components/auth/LoginForm";
import SignUpPage from "./components/auth/SignupForm";
import UploadPage from "./pages/UploadPage";
import AllReportsPage from "./pages/AllReportsPage";
import PatientHistoryPage from "./pages/PatientHistoryPage";
import SettingsPage from "./pages/SettingsPage";

// Wrapper for routes that require a logged-in user
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Spinner size="lg" />
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
}

// Wrapper for public routes to redirect if already logged in
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Spinner size="lg" />
      </div>
    );
  }
  return user ? <Navigate to="/dashboard" replace /> : children;
}

function App() {
  const { profile } = useAuth();

  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUpPage />
            </PublicRoute>
          }
        />

        {/* Common Private Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <SettingsPage />
            </PrivateRoute>
          }
        />

        {/* Patient-Specific Routes */}
        {profile?.role === "Patient" && (
          <>
            <Route
              path="/upload"
              element={
                <PrivateRoute>
                  <UploadPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/history"
              element={
                <PrivateRoute>
                  <PatientHistoryPage />
                </PrivateRoute>
              }
            />
          </>
        )}

        {/* Doctor-Specific Routes */}
        {profile?.role === "Doctor" && (
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <AllReportsPage />
              </PrivateRoute>
            }
          />
        )}

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
