import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import Button from "../shared/Button";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi"; // 📧 Import icons from react-icons

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
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-100">
      <div className="flex flex-col md:flex-row max-w-4xl w-full bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Decorative Side (for larger screens) */}
        <div className="hidden md:flex flex-1 items-center justify-center p-8 bg-indigo-500">
          <img
            src="https://img.freepik.com/premium-vector/mobile-login-concept-illustration_114360-83.jpg"
            alt="Login illustration"
            className="w-full h-auto rounded-lg"
          />
        </div>

        {/* Form Side */}
        <div className="flex-1 p-8 md:p-12">
          <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-6">
            Welcome Back
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Sign in to your account to continue.
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiOutlineMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    placeholder="Email address"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiOutlineLockClosed className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    placeholder="Password"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <Button type="submit" loading={loading} fullWidth>
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-600 hover:text-indigo-500 font-medium transition duration-150"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
