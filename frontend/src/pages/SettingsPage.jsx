import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../services/supabaseClient";
import { Loader2, CheckCircle, AlertTriangle, ShieldCheck } from "lucide-react";

const SettingsPage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ full_name: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ message: "", type: "" });

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      // Supabase's user object contains metadata we can use for profiles
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setProfile({ full_name: user.user_metadata.full_name || "" });
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile update form submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ message: "", type: "" });
    try {
      // Use Supabase client to update user metadata
      const { error } = await supabase.auth.updateUser({
        data: { full_name: profile.full_name },
      });

      if (error) throw error;
      setStatus({ message: "Profile updated successfully!", type: "success" });
    } catch (error) {
      setStatus({ message: "Failed to update profile.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const avatarUrl = `https://api.dicebear.com/8.x/initials/svg?seed=${user?.email}`;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
        Settings
      </h1>
      <p className="mt-1 text-sm text-slate-600 mb-8">
        Manage your profile and account settings.
      </p>

      <div className="max-w-4xl space-y-8">
        {/* Profile Information Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-start gap-6">
            <img
              src={avatarUrl}
              alt="User Avatar"
              className="w-20 h-20 rounded-full bg-slate-200"
            />
            <form onSubmit={handleProfileSubmit} className="flex-1">
              <h2 className="text-xl font-bold text-slate-800">
                Profile Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label
                    htmlFor="full_name"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Full Name
                  </label>
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    value={profile.full_name || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={user?.email}
                    readOnly
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm bg-slate-100 text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="mt-6 border-t border-slate-200 pt-4 flex items-center justify-between">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-slate-400"
                >
                  {saving ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : null}
                  {saving ? "Saving..." : "Update Profile"}
                </button>
                {status.message && (
                  <div
                    className={`flex items-center gap-2 text-sm ${
                      status.type === "success"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {status.type === "success" ? (
                      <CheckCircle size={16} />
                    ) : (
                      <AlertTriangle size={16} />
                    )}
                    {status.message}
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Security Settings Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck size={22} /> Security Settings
          </h2>
          <div className="mt-4 border-t pt-4">
            <p className="text-sm font-medium text-slate-700">
              Change Password
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Update your password to a new, secure one.
            </p>
            <button className="mt-3 px-4 py-2 text-sm font-semibold bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
              Change Password
            </button>
          </div>
          <div className="mt-4 border-t pt-4">
            <p className="text-sm font-medium text-red-600">Delete Account</p>
            <p className="text-sm text-slate-500 mt-1">
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </p>
            <button className="mt-3 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100">
              Delete My Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
