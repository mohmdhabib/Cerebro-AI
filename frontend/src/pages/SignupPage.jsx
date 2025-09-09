import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { signupUser } from "../services/api";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../contexts/AuthContext";

const SignUpPage = () => {
  const { updateGlobalProfile } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    title: "",
    specialty: "",
    institution: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { email, password, ...profileData } = formData;
      const { data } = await signupUser(email, password, profileData);

      await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });

      // Manually update the global state with the new profile
      updateGlobalProfile(data.profile);

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to sign up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - SignUp Form */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-6 py-12 sm:px-12 lg:px-20 xl:px-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-y-auto">
        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-600 to-indigo-700 mb-3 tracking-tight">
              NeuroScan AI
            </h1>
            <p className="text-xl font-bold text-gray-800 mb-2">
              Join Our Medical Network
            </p>
            <p className="text-sm text-gray-600">
              Create your professional account for brain tumor detection
              platform
            </p>
          </div>

          {/* SignUp Form */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 hover:shadow-3xl transition-shadow duration-500">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800">
                  Email Address
                </label>
                <div className="relative group">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your professional email"
                    className="w-full px-5 py-3 pl-12 bg-gray-50/80 border-2 border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 group-hover:border-gray-300"
                  />
                  <div className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200">
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
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800">
                  Password
                </label>
                <div className="relative group">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Create a secure password (6+ characters)"
                    className="w-full px-5 py-3 pl-12 bg-gray-50/80 border-2 border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 group-hover:border-gray-300"
                  />
                  <div className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200">
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
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Professional Information Divider */}
              <div className="flex items-center my-6">
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                <span className="px-4 text-sm font-semibold text-gray-500 bg-white/80 rounded-full">
                  Professional Information
                </span>
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800">
                  Full Name
                </label>
                <div className="relative group">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full px-5 py-3 pl-12 bg-gray-50/80 border-2 border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 group-hover:border-gray-300"
                  />
                  <div className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200">
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
                  </div>
                </div>
              </div>

              {/* Professional Title */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800">
                  Professional Title
                </label>
                <div className="relative group">
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g., M.D., Ph.D., Radiologist"
                    className="w-full px-5 py-3 pl-12 bg-gray-50/80 border-2 border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 group-hover:border-gray-300"
                  />
                  <div className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200">
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
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Specialty */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800">
                  Medical Specialty
                </label>
                <div className="relative group">
                  <input
                    id="specialty"
                    name="specialty"
                    type="text"
                    value={formData.specialty}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Neurology, Radiology, Oncology"
                    className="w-full px-5 py-3 pl-12 bg-gray-50/80 border-2 border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 group-hover:border-gray-300"
                  />
                  <div className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200">
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
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Institution */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800">
                  Institution / Hospital
                </label>
                <div className="relative group">
                  <input
                    id="institution"
                    name="institution"
                    type="text"
                    value={formData.institution}
                    onChange={handleChange}
                    required
                    placeholder="Enter your hospital or institution"
                    className="w-full px-5 py-3 pl-12 bg-gray-50/80 border-2 border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 group-hover:border-gray-300"
                  />
                  <div className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200">
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
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50/80 border-2 border-red-200 rounded-2xl p-4 animate-pulse">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-red-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 font-bold text-lg text-white bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-xl hover:shadow-2xl"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <UserPlus className="w-5 h-5 mr-2" />
                    Create Professional Account
                  </span>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-8 pt-6 border-t border-gray-200/50">
              <p className="text-center text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-blue-600 hover:text-blue-800 transition-colors hover:underline"
                >
                  Sign In Here
                </Link>
              </p>
            </div>

            {/* Professional Notice */}
            <div className="mt-6 bg-blue-50/50 rounded-2xl p-4 border border-blue-200/50">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-blue-700 mb-1">
                    Professional Verification Required
                  </p>
                  <p className="text-xs text-blue-600">
                    Your credentials will be verified before account activation
                    to ensure platform security and compliance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Medical Research Visualization */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-black via-blue-900 to-indigo-900">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-16 left-12 w-3 h-3 bg-cyan-400 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-40 right-24 w-2 h-2 bg-purple-400 rounded-full animate-ping delay-500"></div>
          <div className="absolute bottom-32 left-20 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-16 right-16 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping delay-1000"></div>
        </div>

        {/* DNA helix pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 400 800" fill="none">
            <path
              d="M50 0 Q200 50 350 0 Q200 100 50 150 Q200 200 350 150 Q200 250 50 300"
              stroke="white"
              strokeWidth="2"
            />
            <path
              d="M50 300 Q200 350 350 300 Q200 400 50 450 Q200 500 350 450 Q200 550 50 600"
              stroke="white"
              strokeWidth="2"
            />
            <path
              d="M50 600 Q200 650 350 600 Q200 700 50 750 Q200 800 350 750"
              stroke="white"
              strokeWidth="2"
            />
          </svg>
        </div>

        <div className="relative z-10 ml-12 flex flex-col justify-center items-center p-12 text-white">
          {/* Medical Research Visualization */}
          <div className="mb-8 relative">
            <div className="w-72 h-72 relative">
              {/* Multiple brain scans layout */}
              <div className="absolute inset-0 grid grid-cols-2 gap-4">
                {/* Top left scan */}
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl border-2 border-cyan-400/30 shadow-xl relative overflow-hidden">
                  <svg
                    className="w-full h-full absolute inset-0 text-cyan-300/40"
                    viewBox="0 0 100 100"
                    fill="none"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="30"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="rgba(34, 197, 94, 0.1)"
                    />
                    <circle
                      cx="40"
                      cy="45"
                      r="3"
                      fill="rgba(34, 197, 94, 0.8)"
                      className="animate-pulse"
                    />
                  </svg>
                  <div className="absolute bottom-2 left-2 text-xs font-bold text-green-400">
                    NORMAL
                  </div>
                </div>

                {/* Top right scan */}
                <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl border-2 border-red-400/30 shadow-xl relative overflow-hidden">
                  <svg
                    className="w-full h-full absolute inset-0 text-red-300/40"
                    viewBox="0 0 100 100"
                    fill="none"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="30"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="rgba(239, 68, 68, 0.1)"
                    />
                    <circle
                      cx="55"
                      cy="40"
                      r="6"
                      fill="rgba(239, 68, 68, 0.9)"
                      className="animate-pulse"
                    />
                  </svg>
                  <div className="absolute bottom-2 left-2 text-xs font-bold text-red-400">
                    TUMOR
                  </div>
                </div>

                {/* Bottom left scan */}
                <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-2xl border-2 border-purple-400/30 shadow-xl relative overflow-hidden">
                  <svg
                    className="w-full h-full absolute inset-0 text-purple-300/40"
                    viewBox="0 0 100 100"
                    fill="none"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="30"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="rgba(168, 85, 247, 0.1)"
                    />
                    <circle
                      cx="45"
                      cy="55"
                      r="4"
                      fill="rgba(251, 191, 36, 0.8)"
                      className="animate-pulse delay-500"
                    />
                  </svg>
                  <div className="absolute bottom-2 left-2 text-xs font-bold text-yellow-400">
                    BENIGN
                  </div>
                </div>

                {/* Bottom right scan */}
                <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl border-2 border-emerald-400/30 shadow-xl relative overflow-hidden">
                  <svg
                    className="w-full h-full absolute inset-0 text-emerald-300/40"
                    viewBox="0 0 100 100"
                    fill="none"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="30"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="rgba(16, 185, 129, 0.1)"
                    />
                    <path
                      d="M30 50 Q50 30 70 50 Q50 70 30 50"
                      stroke="rgba(16, 185, 129, 0.6)"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                  <div className="absolute bottom-2 left-2 text-xs font-bold text-emerald-400">
                    ANALYSIS
                  </div>
                </div>
              </div>

              {/* Central processing indicator */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Research metrics */}
            <div className="absolute -top-4 -right-4 bg-blue-500/90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs font-bold animate-pulse">
              10,000+ SCANS ANALYZED
            </div>
            <div className="absolute -bottom-4 -left-4 bg-purple-500/90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs font-bold">
              99.2% ACCURACY
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-purple-200">
              Join Leading
              <br />
              <span className="text-blue-300">Medical Researchers</span>
            </h2>
            <p className="text-xl text-gray-300 mb-6 max-w-md leading-relaxed">
              Collaborate with top medical professionals advancing brain tumor
              detection technology
            </p>
          </div>

          {/* Research Benefits */}
          <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
            <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-bold text-white">Expert Network</p>
                <p className="text-sm text-gray-300">
                  Connect with specialists
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-bold text-white">Research Data</p>
                <p className="text-sm text-gray-300">Access latest findings</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-bold text-white">Continuing Education</p>
                <p className="text-sm text-gray-300">Latest medical insights</p>
              </div>
            </div>
          </div>

    
        </div>

        {/* Bottom gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
    </div>
  );
};

export default SignUpPage;
