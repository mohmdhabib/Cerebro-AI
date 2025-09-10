import React from "react";
import useAuth from "../hooks/useAuth";

const SettingsPage = () => {
  const { user, profile } = useAuth();

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">User Profile</h2>
        <div className="space-y-2">
          <p>
            <strong>Name:</strong> {profile?.full_name}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Role:</strong> {profile?.role}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
