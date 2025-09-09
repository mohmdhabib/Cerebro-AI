import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { createUserProfile } from "../services/api";
import { UserCheck } from "lucide-react";

const OnboardingPage = () => {
  const [profileData, setProfileData] = useState({
    name: "",
    title: "",
    specialty: "",
    institution: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { updateGlobalProfile } = useAuth(); // Use the new, unified function
  const navigate = useNavigate();

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Call the API and get the newly created profile back
      const { data: newProfile } = await createUserProfile(profileData);

      // Update the global state directly with the new data
      updateGlobalProfile(newProfile);

      // Navigate to the dashboard, which will now render correctly
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.error || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md border border-slate-200">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-green-100 rounded-full">
            <UserCheck className="w-6 h-6 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            Complete Your Professional Profile
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Please provide your details to continue.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form inputs remain the same */}
          <div>
            <label
              htmlFor="name"
              className="text-sm font-medium text-slate-700"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={profileData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="title"
              className="text-sm font-medium text-slate-700"
            >
              Professional Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={profileData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="specialty"
              className="text-sm font-medium text-slate-700"
            >
              Specialty
            </label>
            <input
              id="specialty"
              name="specialty"
              type="text"
              value={profileData.specialty}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="institution"
              className="text-sm font-medium text-slate-700"
            >
              Institution / Hospital
            </label>
            <input
              id="institution"
              name="institution"
              type="text"
              value={profileData.institution}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {error && <p className="text-sm text-center text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Saving Profile..." : "Save and Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingPage;
