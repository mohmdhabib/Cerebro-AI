import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Button from "./Button";
const Layout = ({ children }) => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  // frontend/src/components/shared/Layout.jsx -> inside the Layout component

  const handleLogout = async () => {
    const { error } = await logout();
    if (error) {
      console.error("Logout failed:", error.message);
    } else {
      // THE FIX IS HERE: The navigate call ensures you are redirected after logout.
      // The onAuthStateChange listener will also clear state, but this makes it immediate.
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/dashboard" className="text-2xl font-bold text-indigo-600">
            BrainScan AI
          </Link>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {profile?.role === "Patient" && (
                  <Link
                    to="/upload"
                    className="text-gray-600 hover:text-indigo-600"
                  >
                    Upload Scan
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-indigo-600"
                >
                  Dashboard
                </Link>
                <Button onClick={handleLogout} variant="secondary">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-indigo-600"
                >
                  Login
                </Link>
                <Link to="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default Layout;
