import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Upload,
  FileText,
  Users,
  Settings,
  Bell,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const SidebarLink = ({ to, icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center px-4 py-2.5 rounded-lg text-gray-700 hover:bg-cyan-50 transition-colors ${
        isActive ? "bg-cyan-100 text-cyan-800 font-semibold" : ""
      }`
    }
  >
    {icon}
    <span className="ml-3">{children}</span>
  </NavLink>
);

const Layout = ({ children }) => {
  const { logout, user } = useAuth();
  const location = useLocation();

  // A simple function to get the page title from the path
  const getPageTitle = (pathname) => {
    const pathMap = {
      "/": "Brain Tumor Detection Dashboard",
      "/upload": "Upload Scan",
      "/reports": "Reports",
      "/patients": "Patient History",
      "/settings": "Settings",
    };
    return pathMap[pathname] || "NeuroScan";
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col shrink-0">
        <div className="h-16 flex items-center justify-center border-b px-4">
          <h1 className="text-2xl font-bold text-gray-800">NeuroScan</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <SidebarLink to="/" icon={<Home size={20} />}>
            Home
          </SidebarLink>
          <SidebarLink to="/upload" icon={<Upload size={20} />}>
            Upload Scan
          </SidebarLink>
          <SidebarLink to="/reports" icon={<FileText size={20} />}>
            Reports
          </SidebarLink>
          <SidebarLink to="/patients" icon={<Users size={20} />}>
            Patient History
          </SidebarLink>
          <SidebarLink to="/settings" icon={<Settings size={20} />}>
            Settings
          </SidebarLink>
        </nav>
        <div className="p-4 border-t">
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center">
              <img
                src="https://i.pravatar.cc/40"
                alt="Dr. Evelyn Reed"
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-3 text-left">
                <p className="font-semibold text-sm">Dr. Evelyn Reed</p>
                <p className="text-xs text-gray-500">Logout</p>
              </div>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0">
          <h2 className="text-xl font-semibold text-gray-800">
            {getPageTitle(location.pathname)}
          </h2>
          <div className="flex items-center space-x-4">
            <Bell size={22} className="text-gray-600 cursor-pointer" />
            <div className="flex items-center">
              <img
                src="https://i.pravatar.cc/40"
                alt="User"
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-3 text-sm">
                <p className="font-semibold">
                  {user?.email.split("@")[0] || "Dr. Evelyn Reed"}
                </p>
                <p className="text-gray-500">Neurologist</p>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
