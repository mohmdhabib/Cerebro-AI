import React from "react";
import UploadForm from "../components/UploadForm";

const UploadPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/20 rounded-full mb-8">
              <svg
                className="w-12 h-12 text-blue-300"
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
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              AI-Powered MRI Analysis
            </h1>
            <p className="text-lg text-blue-200/80 max-w-2xl mx-auto leading-relaxed">
              Upload your brain MRI scan for a comprehensive analysis using our
              advanced deep learning models. Secure, fast, and accurate.
            </p>
          </div>

          {/* Main Upload Card */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-blue-500/20 overflow-hidden">
            <div className="px-8 py-8 md:px-12 md:py-14">
              <UploadForm />
            </div>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-gray-800/40 backdrop-blur-md rounded-xl p-6 border border-white/10 transition-all duration-300 hover:border-blue-400/50 hover:bg-gray-800/60">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-300"
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
              <h3 className="font-semibold text-white mb-2">
                Secure & Private
              </h3>
              <p className="text-gray-400 text-sm">
                Your data is encrypted and processed with the highest security
                standards, ensuring HIPAA compliance.
              </p>
            </div>

            <div className="bg-gray-800/40 backdrop-blur-md rounded-xl p-6 border border-white/10 transition-all duration-300 hover:border-blue-400/50 hover:bg-gray-800/60">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-300"
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
              <h3 className="font-semibold text-white mb-2">Rapid Analysis</h3>
              <p className="text-gray-400 text-sm">
                Our AI algorithms provide comprehensive results in minutes, not
                hours.
              </p>
            </div>

            <div className="bg-gray-800/40 backdrop-blur-md rounded-xl p-6 border border-white/10 transition-all duration-300 hover:border-blue-400/50 hover:bg-gray-800/60">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-purple-300"
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
              <h3 className="font-semibold text-white mb-2">
                Detailed Insights
              </h3>
              <p className="text-gray-400 text-sm">
                Receive in-depth reports with visual insights and clear,
                actionable recommendations.
              </p>
            </div>
          </div>

          {/* AI Model Information Section */}
          <div className="bg-gray-800/40 backdrop-blur-md rounded-xl p-6 border border-white/10 transition-all duration-300 hover:border-blue-400/50 hover:bg-gray-800/60 mt-8">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-yellow-300"
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
            <h3 className="font-semibold text-white mb-2">AI Model Information</h3>
            <p className="text-gray-400 text-sm">
              Our AI model is trained on a diverse dataset of over 10,000 MRI scans, achieving an accuracy of 98.7%. It is certified for medical-grade analysis and adheres to FDA and CE standards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
