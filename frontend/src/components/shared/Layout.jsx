import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Button from "./Button";

const Layout = ({ children }) => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleLogout = async () => {
    const { error } = await logout();
    if (error) {
      console.error("Logout failed:", error.message);
    } else {
      navigate("/login");
    }
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const sidebarItems = [
    {
      name: "Home",
      href: "/dashboard",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      name: "Upload Scan",
      href: "/upload",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      ),
      showFor: "Patient",
    },
    {
      name: "Reports",
      href: "/reports",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      hideFor: "Patient",
    },
    {
      name: "History",
      href: "/history",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      hideFor: "Doctor",
    },
    {
      name: "Profile",
      href: "/settings",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
  ];

  const isActiveRoute = (href) => {
    return location.pathname === href;
  };

  const UserAvatar = ({
    size = "md",
    showName = false,
    showRole = false,
    className = "",
  }) => {
    const sizeClasses = {
      sm: "w-8 h-8 text-xs",
      md: "w-10 h-10 text-sm",
      lg: "w-12 h-12 text-base",
    };

    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <div
          className={`${sizeClasses[size]} bg-gray-600 rounded-full flex items-center justify-center`}
        >
          <span className="text-white font-semibold">
            {profile?.full_name
              ? profile.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
              : "AJ"}
          </span>
        </div>

        {(showName || showRole) && (
          <div className="flex-1 min-w-0">
            {showName && (
              <div className="text-sm font-semibold text-gray-900 truncate">
                {profile?.full_name || "Alex Johnson"}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <header className="bg-white shadow-sm">
          <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <span className="text-2xl font-bold text-gray-900">
                NeuroScan
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 text-gray-600 hover:text-blue-600 font-medium"
              >
                Sign In
              </Link>
              <Link to="/signup">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
                  Get Started
                </Button>
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex-grow">{children}</main>
      </div>
    );
  }

  const getCurrentPageTitle = () => {
    const currentRoute = sidebarItems.find(
      (item) => item.href === location.pathname
    );
    return currentRoute ? currentRoute.name : "Dashboard";
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 lg:hidden"
          onClick={toggleMobileSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-white shadow-sm transition-transform duration-300 ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center px-6 border-b border-gray-100 flex-shrink-0">
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900">NeuroScan</span>
              <p className="text-xs text-gray-500">Patient Portal</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-1">
            {sidebarItems.map((item, index) => {
              if (item.showFor && profile?.role !== item.showFor) return null;
              if (item.hideFor && profile?.role === item.hideFor) return null;

              const isActive = isActiveRoute(item.href);

              return (
                <Link
                  key={index}
                  to={item.href}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  onClick={() => setIsMobileSidebarOpen(false)}
                >
                  <span
                    className={`flex-shrink-0 ${
                      isActive ? "text-blue-600" : "text-gray-400"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="ml-3">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Profile and Sign Out Section */}
        <div className="border-t border-gray-100 p-4 flex-shrink-0 space-y-3">
          {/* User Profile in Sidebar */}
          <div className="flex items-center space-x-3 px-3 py-2">
            <UserAvatar size="sm" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900 truncate">
                {profile?.full_name || "Alex Johnson"}
              </div>
              <div className="text-xs text-gray-500 capitalize">
                {profile?.role || "Patient"}
              </div>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleLogout}
            className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white shadow-sm flex items-center justify-between px-8 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleMobileSidebar}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {getCurrentPageTitle()}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {location.pathname === "/dashboard" &&
                  "Your health journey is our priority. Here's a summary of your recent activity."}
                {location.pathname === "/upload" &&
                  "Upload your medical scans for AI-powered analysis and insights."}
                {location.pathname === "/reports" &&
                  "View and manage all your medical reports and scan results."}
                {location.pathname === "/history" &&
                  "Track your complete medical history and treatment progress."}
                {location.pathname === "/settings" &&
                  "Manage your account settings and personal information."}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>

            {/* User Profile */}
            <UserAvatar size="sm" showName={true} showRole={true} />

            {/* Sign Out Button */}
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign Out
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <div className="mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
