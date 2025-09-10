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
  const [role, setRole] = useState("Patient");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4 sm:p-8">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Left Side - Decorative Image/Illustration */}
        <div className="hidden md:flex flex-1 items-center justify-center p-12 bg-indigo-600 relative">
          <div className="absolute inset-0 z-0 bg-pattern opacity-10"></div>
          <div className="z-10 text-center">
            <h1 className="text-white text-4xl font-extrabold mb-4">
              Join Our Community
            </h1>
            <p className="text-indigo-200 text-lg">
              Sign up today to connect with healthcare professionals and manage
              your health journey.
            </p>
            <img
              src="https://img.freepik.com/premium-vector/mobile-login-concept-illustration_114360-83.jpg"
              alt="Healthcare illustration"
              className="mt-8 w-full max-w-sm mx-auto"
            />
          </div>
        </div>

        {/* Right Side - The Sign-Up Form */}
        <div className="flex-1 p-8 sm:p-12 lg:p-16">
          <div className="max-w-md mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-2">
              Get Started
            </h2>
            <p className="text-center text-gray-500 mb-8">
              Create your account in seconds.
            </p>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Full Name Input with Icon */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-indigo-400">
                  <HiOutlineUser className="h-5 w-5" />
                </div>
                <input
                  name="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  placeholder="Full Name"
                />
              </div>

              {/* Email Input with Icon */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-indigo-400">
                  <HiOutlineMail className="h-5 w-5" />
                </div>
                <input
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  placeholder="Email address"
                />
              </div>

              {/* Password Input with Icon */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-indigo-400">
                  <HiOutlineLockClosed className="h-5 w-5" />
                </div>
                <input
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  placeholder="Password"
                />
              </div>

              {/* Role Selection - Card-style radio buttons */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  I am a:
                </label>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <label
                    className={`flex-1 flex items-center justify-center p-4 border rounded-xl cursor-pointer transition-all duration-300 relative ${
                      role === "Patient"
                        ? "bg-indigo-50 border-indigo-500 shadow-md scale-105"
                        : "bg-gray-50 border-gray-300 hover:bg-gray-100"
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
                    <FaUser className="h-6 w-6 text-indigo-600 mr-2" />
                    <span className="font-semibold text-gray-700">Patient</span>
                    {role === "Patient" && (
                      <FaCheckCircle className="absolute top-2 right-2 text-indigo-500 h-5 w-5" />
                    )}
                  </label>
                  <label
                    className={`flex-1 flex items-center justify-center p-4 border rounded-xl cursor-pointer transition-all duration-300 relative ${
                      role === "Doctor"
                        ? "bg-indigo-50 border-indigo-500 shadow-md scale-105"
                        : "bg-gray-50 border-gray-300 hover:bg-gray-100"
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
                    <FaUserMd className="h-6 w-6 text-indigo-600 mr-2" />
                    <span className="font-semibold text-gray-700">Doctor</span>
                    {role === "Doctor" && (
                      <FaCheckCircle className="absolute top-2 right-2 text-indigo-500 h-5 w-5" />
                    )}
                  </label>
                </div>
              </div>

              <Button type="submit" loading={loading} fullWidth>
                Sign up
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
