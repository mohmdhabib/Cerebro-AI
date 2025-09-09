import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom"; // Import Link

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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">NeuroScan AI</h1>
          <p className="mt-2 text-sm text-gray-600">
            Secure access for medical professionals
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Username or Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          {error && <p className="text-sm text-center text-red-600">{error}</p>}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
              />
              <span className="ml-2 text-gray-600">Remember me</span>
            </label>
            <a
              href="#"
              className="font-medium text-cyan-600 hover:text-cyan-500"
            >
              Forgot your password?
            </a>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 font-semibold text-white bg-cyan-500 rounded-md hover:bg-cyan-600 disabled:opacity-50 transition-colors"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* --- ADD THIS SECTION --- */}
        <p className="text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-cyan-600 hover:text-cyan-500"
          >
            Sign Up
          </Link>
        </p>
        {/* --- END OF ADDED SECTION --- */}

        <p className="text-xs text-center text-gray-500">
          Security & Privacy Notice: Your data is protected by our strict
          privacy policy.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
