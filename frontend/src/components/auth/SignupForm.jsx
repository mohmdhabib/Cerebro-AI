import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import Button from "../shared/Button";
import { FaUser, FaUserMd, FaCheckCircle } from "react-icons/fa";
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineLockClosed,
} from "react-icons/hi";

const SignUpForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Patient");
  // const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // if (!agreeToTerms) {
    //   toast.error("Please agree to the Terms of Service and Privacy Policy");
    //   return;
    // }

    setLoading(true);
    const { error } = await signUp(email, password, { fullName, role });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created successfully!");
      navigate("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center mr-3 shadow-lg">
            <div className="w-5 h-5 bg-white rounded-md opacity-90"></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">NeuroScan</h1>
        </div>
        <Link
          to="/login"
          className="text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 border shadow-md p-2 rounded"
        >
          Log In
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Title Section */}
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Create your account
            </h2>
            <p className="text-lg text-gray-600">
              Join NeuroScan to get insights about your brain health.
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-4 py-4 bg-gray-50 border border-blue-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-3 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-4 bg-gray-50 border border-blue-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-3 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-4 bg-gray-50 border border-blue-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-3 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200"
                  placeholder="Create a password"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-4 bg-gray-50 border border-blue-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-3 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200"
                  placeholder="Confirm your password"
                />
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  I am a:
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label
                    className={`relative flex items-center justify-center p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                      role === "Patient"
                        ? "bg-gradient-to-r from-cyan-50 to-blue-50 border-indigo-300 shadow-md"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="Patient"
                      checked={role === "Patient"}
                      onChange={(e) => setRole(e.target.value)}
                      className="hidden"
                    />
                    <FaUser
                      className={`h-5 w-5 mr-2 ${
                        role === "Patient" ? "text-blue-600" : "text-gray-500"
                      }`}
                    />
                    <span
                      className={`font-semibold ${
                        role === "Patient" ? "text-blue-800" : "text-gray-700"
                      }`}
                    >
                      Patient
                    </span>
                    {role === "Patient" && (
                      <FaCheckCircle className="absolute top-2 right-2 text-blue-500 h-5 w-5" />
                    )}
                  </label>

                  <label
                    className={`relative flex items-center justify-center p-5 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                      role === "Doctor"
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 shadow-md"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="Doctor"
                      checked={role === "Doctor"}
                      onChange={(e) => setRole(e.target.value)}
                      className="hidden"
                    />
                    <FaUserMd
                      className={`h-5 w-5 mr-2 ${
                        role === "Doctor" ? "text-blue-600" : "text-gray-500"
                      }`}
                    />
                    <span
                      className={`font-semibold ${
                        role === "Doctor" ? "text-blue-800" : "text-gray-700"
                      }`}
                    >
                      Doctor
                    </span>
                    {role === "Doctor" && (
                      <FaCheckCircle className="absolute top-2 right-2 text-blue-500 h-5 w-5" />
                    )}
                  </label>
                </div>
              </div>

              {/* Terms Checkbox */}
              {/* <div className="flex items-start space-x-3">
                <div className="flex items-center h-5">
                  <input
                    id="agreeToTerms"
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                </div>
                <label
                  htmlFor="agreeToTerms"
                  className="text-sm text-gray-600 leading-5"
                >
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Terms of Service and Privacy Policy
                  </a>
                </label>
              </div> */}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 hover:scale-105 shadow-lg hover:shadow-xl"
                }`}
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
