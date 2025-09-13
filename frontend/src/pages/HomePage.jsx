import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-indigo-300/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-violet-200/30 to-purple-300/30 rounded-full blur-3xl"></div>
        <div className="absolute top-20 left-1/4 w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-1/3 w-1 h-1 bg-blue-500 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/3 left-1/6 w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Compact Professional Header */}
      <header className="relative z-20 px-6 py-3 backdrop-blur-md bg-white/95 border-b border-white/40">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center mr-3 shadow-xl shadow-indigo-500/25 relative group hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl blur opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
              <svg
                className="w-6 h-6 text-white relative z-10"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C9.79 2 8 3.79 8 6c0 .35.06.68.14 1H7c-1.66 0-3 1.34-3 3v1c0 1.66 1.34 3 3 3h1.14c-.08.32-.14.65-.14 1 0 2.21 1.79 4 4 4s4-1.79 4-4c0-.35-.06-.68-.14-1H17c1.66 0 3-1.34 3-3v-1c0-1.66-1.34-3-3-3h-1.14c.08-.32.14-.65.14-1 0-2.21-1.79-4-4-4z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-gray-900 via-indigo-900 to-violet-900 bg-clip-text text-transparent">
                NeuroScan
              </h1>
              <p className="text-xs font-semibold text-indigo-600/80">
                AI Medical Technology
              </p>
            </div>
          </div>

    

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-5 py-2 text-indigo-700 font-semibold hover:text-indigo-900 hover:bg-indigo-50/80 rounded-lg transition-all duration-200 border border-transparent hover:border-indigo-100">
              Sign In
            </Link>
            <Link to='/signup' className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-300 relative overflow-hidden group">
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-violet-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10">
        {/* Hero Content Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* Professional Badge */}
            <div className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-800 rounded-full text-sm font-bold border border-indigo-200/60 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <span className="w-2.5 h-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full mr-2 animate-pulse"></span>
              🧠 AI-Powered Medical Technology
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl lg:text-6xl font-black leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-indigo-900 to-violet-900 bg-clip-text text-transparent block">
                Advanced Brain
              </span>
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent block">
                Tumor Detection
              </span>
            </h1>

            {/* Professional Description */}
            <p className="text-lg font-medium text-gray-700 max-w-3xl mx-auto leading-relaxed">
              NeuroScan revolutionizes medical diagnostics with{" "}
              <span className="text-indigo-600 font-bold">
                cutting-edge AI technology
              </span>
              , providing accurate brain tumor detection and analysis from MRI
              scans in seconds, empowering healthcare professionals with{" "}
              <span className="text-violet-600 font-bold">
                instant insights
              </span>
              .
            </p>

            {/* Professional Stats */}
            <div className="flex flex-wrap gap-8 justify-center pt-6">
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="text-3xl font-black text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text">
                  99.7%
                </div>
                <div className="text-sm font-bold text-gray-600 group-hover:text-indigo-600 transition-colors duration-300">
                  Accuracy Rate
                </div>
              </div>
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="text-3xl font-black text-transparent bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text">
                  1.8s
                </div>
                <div className="text-sm font-bold text-gray-600 group-hover:text-violet-600 transition-colors duration-300">
                  Average Analysis
                </div>
              </div>
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="text-3xl font-black text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">
                  75K+
                </div>
                <div className="text-sm font-bold text-gray-600 group-hover:text-blue-600 transition-colors duration-300">
                  Scans Analyzed
                </div>
              </div>
            </div>

            {/* Action Buttons Below Stats */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link to='/signup' className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-300 relative overflow-hidden group">
                <span className="relative z-10 flex items-center justify-center">
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
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  Create Account
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-violet-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>

              <Link to='/login' className="w-full sm:w-auto px-8 py-3 bg-white text-indigo-700 font-bold rounded-xl shadow-xl border-2 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 hover:scale-105 transition-all duration-300 group">
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
                  Sign In
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* Professional Cover Image Section with max-w-7xl */}
        <section className="relative w-full mt-12 mb-20 overflow-hidden">
          {/* Cover Image Container with max-w-7xl */}
          <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
            <div className="relative h-[500px] lg:h-[600px] rounded-3xl shadow-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-violet-900">
              {/* Medical Brain Scan Cover Image */}
              <img
                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                alt="Advanced Medical Brain Scanning Technology"
                className="w-full h-full object-cover opacity-85"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80";
                }}
              />

              {/* Professional Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 via-indigo-900/70 to-purple-900/60"></div>

              {/* Technology Indicators */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Scanning Lines */}
                <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-70 animate-pulse"></div>
                <div
                  className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-80 animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
                <div
                  className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400 to-transparent opacity-60 animate-pulse"
                  style={{ animationDelay: "2s" }}
                ></div>

                {/* Corner Brackets - Professional Design */}
                <div className="absolute top-6 left-6 w-12 h-12 border-l-3 border-t-3 border-cyan-400 opacity-80 animate-pulse"></div>
                <div className="absolute top-6 right-6 w-12 h-12 border-r-3 border-t-3 border-cyan-400 opacity-80 animate-pulse"></div>
                <div className="absolute bottom-6 left-6 w-12 h-12 border-l-3 border-b-3 border-cyan-400 opacity-80 animate-pulse"></div>
                <div className="absolute bottom-6 right-6 w-12 h-12 border-r-3 border-b-3 border-cyan-400 opacity-80 animate-pulse"></div>
              </div>

              {/* Professional Data Overlay */}
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end text-white">
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-cyan-400 tracking-wide">
                    ANALYSIS STATUS
                  </div>
                  <div className="text-xl font-bold">SCAN COMPLETE</div>
                  <div className="text-xs opacity-90">
                    Neural pathways detected and analyzed
                  </div>
                </div>

                <div className="space-y-1 text-right">
                  <div className="text-xs font-semibold text-violet-400 tracking-wide">
                    PROCESSING TIME
                  </div>
                  <div className="text-xl font-bold">1.8 SECONDS</div>
                  <div className="text-xs opacity-90">
                    Real-time AI analysis
                  </div>
                </div>
              </div>

              {/* Floating Professional Elements */}
              <div className="absolute top-16 right-16 w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-400/40 rounded-xl flex items-center justify-center animate-pulse">
                <svg
                  className="w-8 h-8 text-cyan-400"
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

              <div
                className="absolute bottom-16 left-16 w-14 h-14 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 backdrop-blur-sm border border-indigo-400/40 rounded-lg flex items-center justify-center animate-pulse"
                style={{ animationDelay: "1s" }}
              >
                <svg
                  className="w-7 h-7 text-indigo-400"
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

              {/* Center Content Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white max-w-2xl px-6">
                  <h2 className="text-3xl lg:text-4xl font-bold mb-4 opacity-95">
                    Precision AI Diagnostics
                  </h2>
                  <p className="text-lg opacity-90 leading-relaxed">
                    Experience the future of medical imaging with our advanced
                    neural networks
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Professional Feature Cards Section */}
        <section className="container mx-auto px-4 mb-24">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-gray-900 mb-4">
                Professional-Grade Features
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Built for healthcare professionals who demand accuracy,
                security, and efficiency in medical diagnostics
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard
                title="AI-Powered Analysis"
                description="Our advanced machine learning algorithms provide accurate tumor detection and classification with unprecedented precision and reliability for clinical environments."
                icon={
                  <svg
                    className="w-8 h-8 text-white"
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
                }
                gradient="from-indigo-500 to-blue-600"
              />
              <FeatureCard
                title="Enterprise Security"
                description="Your medical data is protected with enterprise-grade encryption and secure cloud infrastructure, ensuring complete HIPAA compliance and patient privacy protection."
                icon={
                  <svg
                    className="w-8 h-8 text-white"
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
                }
                gradient="from-violet-500 to-purple-600"
              />
              <FeatureCard
                title="Clinical Integration"
                description="Seamlessly integrate with existing hospital systems and workflow management platforms for efficient clinical decision-making and comprehensive patient care coordination."
                icon={
                  <svg
                    className="w-8 h-8 text-white"
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
                }
                gradient="from-emerald-500 to-teal-600"
              />
            </div>
          </div>
        </section>
      </main>

      {/* Professional Footer */}
      <footer className="relative z-10 bg-gradient-to-r from-gray-900 to-indigo-900 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Footer Content */}
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
              {/* Logo Section */}
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center mr-3 shadow-xl">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C9.79 2 8 3.79 8 6c0 .35.06.68.14 1H7c-1.66 0-3 1.34-3 3v1c0 1.66 1.34 3 3 3h1.14c-.08.32-.14.65-.14 1 0 2.21 1.79 4 4 4s4-1.79 4-4c0-.35-.06-.68-.14-1H17c1.66 0 3-1.34 3-3v-1c0-1.66-1.34-3-3-3h-1.14c.08-.32.14-.65.14-1 0-2.21-1.79-4-4-4z" />
                  </svg>
                </div>
                <div>
                  <span className="text-xl font-bold text-white">
                    NeuroScan
                  </span>
                  <p className="text-indigo-300 text-xs">
                    AI Medical Technology
                  </p>
                </div>
              </div>

              {/* Professional Links */}
              <div className="flex flex-col lg:flex-row items-center space-y-3 lg:space-y-0 lg:space-x-6">
                <div className="text-center lg:text-left">
                  <p className="text-gray-300 font-medium">
                    © {new Date().getFullYear()} NeuroScan. All rights reserved.
                  </p>
                  <p className="text-indigo-400 text-sm">
                    Advancing healthcare through AI innovation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Enhanced Professional Feature Card Component
const FeatureCard = ({ title, description, icon, gradient }) => {
  return (
    <div className="group bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/60 hover:border-indigo-200 hover:-translate-y-2 relative overflow-hidden">
      {/* Professional background gradient on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-xl`}
      ></div>

      <div className="relative z-10">
        <div
          className={`inline-flex p-3 bg-gradient-to-br ${gradient} rounded-xl shadow-lg shadow-indigo-500/20 mb-4 group-hover:scale-105 transition-transform duration-300`}
        >
          <div className="text-white">{icon}</div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-800 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed text-sm group-hover:text-gray-800 transition-colors duration-300">
          {description}
        </p>
      </div>
    </div>
  );
};

export default HomePage;
