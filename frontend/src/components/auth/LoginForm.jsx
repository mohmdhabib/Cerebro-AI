import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import Button from "../shared/Button";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await login(email, password);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Logged in successfully!");
      navigate("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center">
          {/* Brain Logo */}
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-teal-500 rounded-xl flex items-center justify-center mr-3 shadow-lg">
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C9.79 2 8 3.79 8 6c0 .35.06.68.14 1H7c-1.66 0-3 1.34-3 3v1c0 1.66 1.34 3 3 3h1.14c-.08.32-.14.65-.14 1 0 2.21 1.79 4 4 4s4-1.79 4-4c0-.35-.06-.68-.14-1H17c1.66 0 3-1.34 3-3v-1c0-1.66-1.34-3-3-3h-1.14c.08-.32.14-.65.14-1 0-2.21-1.79-4-4-4zm0 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-5 5h1c.55 0 1 .45 1 1s-.45 1-1 1H7c-.55 0-1-.45-1-1s.45-1 1-1zm10 0c.55 0 1 .45 1 1s-.45 1-1 1h-1c-.55 0-1-.45-1-1s.45-1 1-1h1zm-5 5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">NeuroScan</h1>
        </div>
        <Link
          to="/signup"
          className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Sign Up
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          {/* Title Section */}
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Welcome Back
            </h2>
            <p className="text-lg text-gray-600">
              Sign in to your account to continue your brain health journey.
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-2xl shadow-xl p-10 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-3 focus:ring-cyan-100 focus:border-cyan-400 transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-3 focus:ring-cyan-100 focus:border-cyan-400 transition-all duration-200"
                  placeholder="Enter your password"
                />
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <a
                  href="#"
                  className="text-sm text-cyan-600 hover:text-cyan-700 font-medium transition-colors duration-200"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 hover:scale-105 shadow-lg hover:shadow-xl"
                }`}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-cyan-600 hover:text-cyan-700 font-semibold transition-colors duration-200"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
