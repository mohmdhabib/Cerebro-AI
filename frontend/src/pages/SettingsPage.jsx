import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { updateUserProfile } from "../services/api";
import {
  Loader2,
  CheckCircle,
  AlertTriangle,
  ShieldCheck,
  Camera,
  UserCircle,
} from "lucide-react";

// A dedicated Avatar component for consistent display
const Avatar = ({ src, className }) => {
  if (src) {
    return <img src={src} alt="User Avatar" className={className} />;
  }
  // Fallback to a generic icon if no src is provided
  return (
    <div
      className={`${className} flex items-center justify-center bg-slate-200 text-slate-500`}
    >
      <UserCircle size="75%" />
    </div>
  );
};

const SettingsPage = () => {
  const { user, profile: authProfile, updateGlobalProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    specialty: "",
    institution: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ message: "", type: "" });
  const fileInputRef = useRef(null);

  // Effect to populate the form when the global profile loads or changes
  useEffect(() => {
    if (authProfile) {
      setFormData({
        name: authProfile.name || "",
        title: authProfile.title || "",
        specialty: authProfile.specialty || "",
        institution: authProfile.institution || "",
      });
    }
  }, [authProfile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // This function handles the submission of both text and image data
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ message: "", type: "" });

    try {
      // Use FormData to send both text fields and the optional file
      const data = new FormData();
      data.append("name", formData.name);
      data.append("title", formData.title);
      data.append("specialty", formData.specialty);
      data.append("institution", formData.institution);

      if (avatarFile) {
        data.append("avatar", avatarFile);
      }

      // Call the API function directly to update the profile
      const { data: updatedProfile } = await updateUserProfile(data);

      // Update the global state in the context to reflect changes instantly
      updateGlobalProfile(updatedProfile);

      setStatus({ message: "Profile updated successfully!", type: "success" });
      setAvatarFile(null); // Clear the staged file after upload
      setPreviewUrl(null); // Clear the preview image
    } catch (error) {
      setStatus({
        message: error.response?.data?.error || "Failed to update profile.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const currentAvatarUrl = previewUrl || authProfile?.avatar_url;

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
        Settings
      </h1>
      <p className="mt-1 text-sm text-slate-600 mb-8">
        Manage your professional profile and account settings.
      </p>
      <div className="max-w-4xl space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <form
            onSubmit={handleFormSubmit}
            className="flex flex-col md:flex-row items-start gap-6"
          >
            {/* Avatar Upload Section */}
            <div className="relative group w-24 flex-shrink-0">
              <Avatar
                src={currentAvatarUrl}
                className="w-24 h-24 rounded-full object-cover"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera size={28} className="text-white" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarSelect}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Profile Information Form */}
            <div className="flex-1 w-full">
              <h2 className="text-xl font-bold text-slate-800">
                Professional Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Professional Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="specialty"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Specialty
                  </label>
                  <input
                    id="specialty"
                    name="specialty"
                    type="text"
                    value={formData.specialty}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="institution"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Institution / Hospital
                  </label>
                  <input
                    id="institution"
                    name="institution"
                    type="text"
                    value={formData.institution}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck size={22} /> Account Security
          </h2>
          <div className="mt-4 border-t pt-4">
            <p className="text-sm font-medium text-slate-700">Email Address</p>
            <p className="text-sm text-slate-500 mt-1">{user?.email}</p>
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
