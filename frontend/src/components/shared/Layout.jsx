import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Upload,
  FileText,
  Users,
  Settings,
  Bell,
  Menu,
  X,
  LogOut,
  BrainCircuit,
  UserCircle, // Added for the default avatar
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

// A dedicated Avatar component for consistent display
const Avatar = ({ src, className }) => {
  // If a custom avatar URL is provided, display the image.
  if (src) {
    return (
      <img
        src={src}
        alt="User Avatar"
        className={className}
        // Fallback in case the image link is broken
        onError={(e) => (e.currentTarget.style.display = "none")}
      />
    );
  }

  // Otherwise, display the default UserCircle icon.
  return (
    <div
      className={`${className} flex items-center justify-center bg-slate-200 text-slate-500`}
    >
      <UserCircle size="75%" />
    </div>
  );
};

const SidebarLink = ({ to, icon, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-200 ${
        isActive
          ? "bg-indigo-100 text-indigo-700 font-semibold"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`
    }
  >
    {icon}
    <span className="ml-3">{children}</span>
  </NavLink>
);

const SidebarContent = ({ closeSidebar }) => {
  const { logout, user, profile } = useAuth();

  const avatarUrl = profile?.avatar_url; // We only need the URL, the Avatar component handles the fallback
  const displayName = profile?.full_name || user?.email;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 h-full">
      {/* Header with Logo */}
      <div className="h-16 flex items-center justify-between border-b border-slate-200 px-4">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-7 w-7 text-indigo-600" />
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            NeuroScan
          </h1>
        </div>
        <button
          onClick={closeSidebar}
          className="md:hidden p-2 rounded-full hover:bg-slate-100"
        >
          <X size={20} className="text-slate-600" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-4">
        <div>
          <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Menu
          </h3>
          <div className="space-y-1">
            <SidebarLink
              to="/"
              icon={<Home size={20} />}
              onClick={closeSidebar}
            >
              Home
            </SidebarLink>
            <SidebarLink
              to="/upload"
              icon={<Upload size={20} />}
              onClick={closeSidebar}
            >
              Upload Scan
            </SidebarLink>
            <SidebarLink
              to="/reports"
              icon={<FileText size={20} />}
              onClick={closeSidebar}
            >
              Reports
            </SidebarLink>
            <SidebarLink
              to="/patients"
              icon={<Users size={20} />}
              onClick={closeSidebar}
            >
              Patient History
            </SidebarLink>
          </div>
        </div>
        <div>
          <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            General
          </h3>
          <div className="space-y-1">
            <SidebarLink
              to="/settings"
              icon={<Settings size={20} />}
              onClick={closeSidebar}
            >
              Settings
            </SidebarLink>
          </div>
        </div>
      </nav>

      {/* Footer with Logout and Profile Link */}
      <div className="p-4 border-t border-slate-200">
        <button
          onClick={logout}
          className="flex items-center w-full px-3 py-2.5 rounded-md text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-700 group mb-2 transition-colors duration-200"
        >
          <LogOut
            size={20}
            className="mr-3 text-slate-500 group-hover:text-red-600 transition-colors duration-200"
          />
          <span>Logout</span>
        </button>
        <NavLink
          to="/settings"
          onClick={closeSidebar}
          className="block w-full p-2 rounded-lg transition-colors duration-200 hover:bg-slate-100"
        >
          <div className="flex items-center">
            <Avatar
              src={avatarUrl}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="ml-3 text-left overflow-hidden">
              <p
                className="font-semibold text-sm text-slate-800 truncate"
                title={displayName}
              >
                {displayName}
              </p>
              <p
                className="text-xs text-slate-500 truncate"
                title={user?.email}
              >
                {user?.email}
              </p>
            </div>
          </div>
        </NavLink>
      </div>
    </aside>
  );
};

const Layout = ({ children }) => {
  const { user, profile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const getPageTitle = (pathname) => {
    const pathMap = {
      "/": "Dashboard",
      "/upload": "Upload Scan",
      "/reports": "Reports",
      "/patients": "Patient History",
      "/settings": "Settings",
    };
    return pathMap[pathname] || "NeuroScan";
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target))
        setIsProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const avatarUrl = profile?.avatar_url;
  const displayName = profile?.full_name || user?.email;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800">
      <div className="hidden md:flex md:shrink-0">
        <SidebarContent closeSidebar={() => {}} />
      </div>
      <div
        className={`fixed inset-y-0 left-0 z-40 md:hidden transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent closeSidebar={() => setIsSidebarOpen(false)} />
      </div>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-md text-slate-600 hover:bg-slate-100"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-800">
              {getPageTitle(location.pathname)}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900">
                <Bell size={20} />
              </button>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            </div>
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-slate-100"
              >
                <Avatar
                  src={avatarUrl}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div className="ml-1 text-sm hidden sm:block text-left">
                  <p
                    className="font-semibold text-slate-700 text-sm truncate"
                    title={displayName}
                  >
                    {displayName}
                  </p>
                </div>
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-slate-200">
                  <div className="px-4 py-3 border-b border-slate-200">
                    <p className="text-sm font-medium text-slate-800">
                      Signed in as
                    </p>
                    <p
                      className="text-sm text-slate-500 truncate"
                      title={user?.email}
                    >
                      {user?.email}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      navigate("/settings");
                      setIsProfileOpen(false);
                    }}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    <Settings size={16} className="mr-2" /> Account Settings
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setIsProfileOpen(false);
                    }}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    <LogOut size={16} className="mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
