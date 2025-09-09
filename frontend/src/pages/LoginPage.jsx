import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("you@example.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error } = await login(email, password);
      if (error) throw error;
      navigate("/");
    } catch (err) {
      setError(
        err.message || "Failed to log in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Login Form */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-6 py-12 sm:px-12 lg:px-20 xl:px-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 3C8.686 3 6 5.686 6 9c0 2.5 1.5 4.5 3 6l3 3 3-3c1.5-1.5 3-3.5 3-6 0-3.314-2.686-6-6-6z"
                />
                <circle cx="12" cy="9" r="2" strokeWidth={1.5} />
              </svg>
            </div>
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-600 to-indigo-700 mb-3 tracking-tight">
              NeuroScan AI
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              Advanced Brain Tumor Detection Platform
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Secure access for medical professionals
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 hover:shadow-3xl transition-shadow duration-500">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800 mb-3">
                  Username or Email
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-5 py-4 pl-12 bg-gray-50/80 border-2 border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 group-hover:border-gray-300"
                    placeholder="Enter your email address"
                  />
                  <div className="absolute left-4 top-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200">
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800 mb-3">
                  Password
                </label>
                <div className="relative group">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-5 py-4 pl-12 bg-gray-50/80 border-2 border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 group-hover:border-gray-300"
                    placeholder="Enter your password"
                  />
                  <div className="absolute left-4 top-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200">
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
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
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
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                    Login
                  </span>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 pt-6 border-t border-gray-200/50">
              <p className="text-center text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-bold text-blue-600 hover:text-blue-800 transition-colors hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>

            {/* Security Notice */}
            <div className="mt-6 bg-gray-50/50 rounded-2xl p-4 border border-gray-200/50">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-1">
                    HIPAA Compliant & Secure
                  </p>
                  <p className="text-xs text-gray-600">
                    Your medical data is protected by enterprise-grade
                    encryption and strict privacy policies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Brain Scan Visualization */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-1 h-1 bg-purple-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-40 left-16 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 right-32 w-2 h-2 bg-cyan-400 rounded-full animate-ping delay-500"></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>

        {/* Main Brain Scan Image */}
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
          {/* Brain Scan Visualization */}
          <div className="mb-8 relative">
            <div className="w-80 h-80 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full border-4 border-blue-400/30 shadow-2xl relative overflow-hidden">
              {/* Brain outline */}
              <svg
                className="w-full h-full absolute inset-0 text-blue-300/60 animate-pulse"
                viewBox="0 0 400 400"
                fill="none"
              >
                <path
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="rgba(59, 130, 246, 0.1)"
                  d="M200 50 C280 50 350 120 350 200 C350 280 280 350 200 350 C120 350 50 280 50 200 C50 120 120 50 200 50 Z"
                />
                <circle
                  cx="150"
                  cy="180"
                  r="15"
                  fill="rgba(239, 68, 68, 0.8)"
                  className="animate-pulse"
                />
                <circle
                  cx="250"
                  cy="220"
                  r="8"
                  fill="rgba(34, 197, 94, 0.8)"
                  className="animate-pulse delay-500"
                />
                <path
                  stroke="rgba(99, 102, 241, 0.6)"
                  strokeWidth="2"
                  fill="none"
                  d="M100 200 Q200 150 300 200 Q200 250 100 200"
                />
                <path
                  stroke="rgba(168, 85, 247, 0.6)"
                  strokeWidth="2"
                  fill="none"
                  d="M200 100 Q150 200 200 300 Q250 200 200 100"
                />
              </svg>

              {/* Scanning lines animation */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent w-full h-2 animate-pulse"
                style={{ top: "45%", animation: "scan 3s linear infinite" }}
              ></div>
            </div>

            {/* Floating diagnostic info */}
            <div className="absolute -top-4 -right-4 bg-red-500/90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs font-bold animate-pulse">
              TUMOR DETECTED
            </div>
            <div className="absolute -bottom-4 -left-4 bg-green-500/90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs font-bold">
              95.7% CONFIDENCE
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
              Revolutionary
              <br />
              <span className="text-cyan-300">AI Diagnostics</span>
            </h2>
            <p className="text-xl text-gray-300 mb-6 max-w-md leading-relaxed">
              Advanced machine learning algorithms for precise brain tumor
              detection and analysis
            </p>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
            <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-bold text-white">99.2% Accuracy</p>
                <p className="text-sm text-gray-300">
                  Clinical grade precision
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-bold text-white">Real-time Analysis</p>
                <p className="text-sm text-gray-300">Instant results</p>
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-bold text-white">HIPAA Secure</p>
                <p className="text-sm text-gray-300">Enterprise encryption</p>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes scan {
            0% {
              top: 0%;
            }
            100% {
              top: 95%;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default LoginPage;
