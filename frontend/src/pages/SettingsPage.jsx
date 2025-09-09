import React from "react";
import { useAuth } from "../contexts/AuthContext";

const SettingsPage = () => {
  const { user } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to update settings would go here
    alert("Settings saved!");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
      <p className="mt-1 text-gray-600 mb-8">
        Manage your profile, preferences, and security settings.
      </p>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Account Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-4">
            Account Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                defaultValue="Dr. Evelyn Reed"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                value={user?.email}
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                defaultValue="••••••••"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
              <a
                href="#"
                className="text-sm text-blue-600 hover:underline mt-1 inline-block"
              >
                Change Password
              </a>
            </div>
          </div>
          <div className="mt-6 border-t pt-4">
            <button
              type="submit"
              className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Update Profile
            </button>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-4">
            Notification Preferences
          </h2>
          <div className="mt-6 space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              <span className="ml-3 text-sm text-gray-700">
                Receive email notifications for new patient scans
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              <span className="ml-3 text-sm text-gray-700">
                Get alerts for critical findings
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              <span className="ml-3 text-sm text-gray-700">
                Receive weekly summary reports
              </span>
            </label>
          </div>
          <div className="mt-6 border-t pt-4">
            <button
              type="submit"
              className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
