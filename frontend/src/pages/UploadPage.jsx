import React from "react";
import UploadForm from "../components/UploadForm";

const UploadPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 ">
        <div className="max-w-7xl mx-auto">
          {/* Header Section
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-8 shadow-xl border-4 border-white relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full animate-pulse opacity-75"></div>
              <svg
                className="w-12 h-12 text-white relative z-10"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.871,12.093c-0.426-0.234-0.833-0.5-1.222-0.795c-1.24-0.938-1.918-2.21-1.918-3.536c0-2.485,2.015-4.5,4.5-4.5
		c1.76,0,3.271,1.011,4.021,2.471c0.067,0.131,0.13,0.264,0.188,0.399c0.435,1.014,1.279,1.858,2.293,2.293
		c0.135,0.058,0.268,0.121,0.399,0.188C14.079,9.271,15.59,10.282,17.35,10.282c2.485,0,4.5,2.015,4.5,4.5
		c0,1.326-0.678,2.598-1.918,3.536c-0.389,0.295-0.796,0.561-1.222,0.795c-0.75,0.413-1.568,0.68-2.432,0.78
		c-1.056,0.123-2.137-0.08-3.082-0.572c-0.215-0.112-0.426-0.23-0.63-0.354c-0.995-0.608-2.142-0.938-3.33-0.938
		c-1.188,0-2.335,0.33-3.33,0.938c-0.204,0.124-0.415,0.242-0.63,0.354C6.437,18.21,5.356,18.413,4.3,18.29
		C3.436,18.193,2.618,17.926,1.868,17.513C1.382,17.25,0.929,16.92,0.52,16.534C0.188,16.22,0,15.8,0,15.364
		c0-0.561,0.292-1.085,0.781-1.413c0.234-0.157,0.48-0.303,0.735-0.44C2.482,12.93,3.651,12.5,4.871,12.093z M12,2.782
		c-1.933,0-3.5,1.567-3.5,3.5c0,0.813,0.28,1.559,0.75,2.16c0.038,0.049,0.077,0.097,0.117,0.145C9.805,9.02,10.857,9.282,12,9.282
		s2.195-0.262,2.632-0.695c0.04-0.048,0.079-0.096,0.117-0.145c0.47-0.601,0.75-1.347,0.75-2.16C15.5,4.349,13.933,2.782,12,2.782z
		 M8.5,13.782c-1.933,0-3.5,1.567-3.5,3.5c0,1.304,0.713,2.438,1.781,3.054C7.22,20.62,7.844,20.782,8.5,20.782
		c1.933,0,3.5-1.567,3.5-3.5S10.433,13.782,8.5,13.782z M15.5,13.782c-1.933,0-3.5,1.567-3.5,3.5s1.567,3.5,3.5,3.5
		c0.656,0,1.28-0.162,1.719-0.448c1.068-0.616,1.781-1.75,1.781-3.052C19,15.349,17.433,13.782,15.5,13.782z"
                />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6 leading-tight">
              AI-Powered MRI Analysis
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed font-medium">
              Upload your brain MRI scan for a comprehensive analysis using our
              advanced deep learning models. Secure, fast, and accurate.
            </p>
          </div> */}

          {/* Main Upload Card */}
          <div className="relative mb-16">
            {/* Decorative background elements */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-200/50 overflow-hidden">
              {/* Glassmorphism effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-sm"></div>
              <div className="relative px-4 py-4 md:px-7 md:py-7">
                <UploadForm />
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="group relative bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-gray-200/50 transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-2">
              {/* Animated background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors duration-300">
                  Secure & Private
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  Your data is encrypted and processed with the highest security
                  standards, ensuring HIPAA compliance.
                </p>
              </div>
            </div>

            <div className="group relative bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-gray-200/50 transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-2">
              {/* Animated background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-sky-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  Rapid Analysis
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  Our AI algorithms provide comprehensive results in minutes,
                  not hours.
                </p>
              </div>
            </div>

            <div className="group relative bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-gray-200/50 transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-2">
              {/* Animated background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-violet-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 17v-2a4 4 0 014-4h2a4 4 0 014 4v2m-6 4h.01M9 13h.01M15 13h.01M12 21h.01M12 17h.01M12 13h.01M12 9h.01M12 5h.01"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                  Detailed Insights
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  Receive in-depth reports with visual insights and clear,
                  actionable recommendations.
                </p>
              </div>
            </div>
          </div>

          {/* AI Model Information Section */}
          <div className="group relative bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-gray-200/50 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] mt-12">
            {/* Animated background on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-orange-600 transition-colors duration-300">
                AI Model Information
              </h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                Our AI model is trained on a diverse dataset of over 10,000 MRI
                scans, achieving an accuracy of 98.7%. It is certified for
                medical-grade analysis and adheres to FDA and CE standards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
