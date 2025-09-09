import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../services/supabaseClient";
import { updateProfile } from "../services/api";
import {
  Loader2,
  CheckCircle,
  AlertTriangle,
  ShieldCheck,
  Upload,
} from "lucide-react";

const SettingsPage = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [formData, setFormData] = useState({ full_name: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ message: "", type: "" });

  useEffect(() => {
    if (profile) {
      setFormData({ full_name: profile.full_name || "" });
      setAvatarPreview(profile.avatar_url || null);
      setLoading(false);
    }
  }, [profile]);

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ message: "", type: "" });
    try {
      let avatarUrl = profile.avatar_url;

      if (avatarFile) {
        const filePath = `public/${user.id}/${Date.now()}_${avatarFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatarFile, { upsert: true });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(filePath);
        avatarUrl = publicUrl;
      }

      await updateProfile({
        full_name: formData.full_name,
        avatar_url: avatarUrl,
      });

      await refreshProfile();

      setStatus({ message: "Profile updated successfully!", type: "success" });
      setAvatarFile(null);
    } catch (error) {
      setStatus({
        message: error.message || "Failed to update profile.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const currentAvatar =
    avatarPreview ||
    `https://api.dicebear.com/8.x/initials/svg?seed=${user?.email}`;

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
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-start gap-6"
          >
            <div className="flex-shrink-0">
              <img
                src={currentAvatar}
                alt="User Avatar"
                className="w-24 h-24 rounded-full bg-slate-200 object-cover"
              />
              <label
                htmlFor="avatar-upload"
                className="mt-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer flex items-center justify-center gap-1"
              >
                <Upload size={14} /> Change
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            <div className="flex-1 w-full">
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
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
