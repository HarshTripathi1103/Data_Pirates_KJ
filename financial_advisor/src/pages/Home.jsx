import React from 'react';
import { Link } from 'react-router-dom';
import { FiBarChart2, FiBriefcase, FiTrendingUp } from 'react-icons/fi';

function Home() {
  return (
    <div className="min-h-screen bg-[#0A0F1E] text-[#E4E7EB]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-[#4CAF50]">AI-Powered</span> Financial Insights
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">
              Get real-time market analysis, financial projections, and investment strategies powered by advanced AI technology.
            </p>
            <Link
              to="/chat"
              className="inline-flex items-center px-8 py-4 bg-[#4CAF50] text-white font-semibold rounded-lg hover:bg-[#45a049] transition-colors"
            >
              Start Now
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#1A1F2E] p-8 rounded-lg border border-[#2A2F3E]">
            <div className="text-[#4CAF50] mb-4">
              <FiBarChart2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Market Trend Analysis</h3>
            <p className="text-gray-400">
              Get real-time insights into market trends, sector performance, and economic indicators.
            </p>
          </div>
          <div className="bg-[#1A1F2E] p-8 rounded-lg border border-[#2A2F3E]">
            <div className="text-[#4CAF50] mb-4">
              <FiBriefcase className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Company Analysis</h3>
            <p className="text-gray-400">
              Detailed financial projections and analysis for specific companies and sectors.
            </p>
          </div>
          <div className="bg-[#1A1F2E] p-8 rounded-lg border border-[#2A2F3E]">
            <div className="text-[#4CAF50] mb-4">
              <FiTrendingUp className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Investment Strategies</h3>
            <p className="text-gray-400">
              Personalized investment recommendations based on your goals and market conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;