import React, { useState } from 'react';

const AnalysisForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    analysisType: 'market',
    industry: 'technology',
    timeFrame: '12',
    metrics: [],
    marketConditions: {
      inflation: '',
      interestRate: '',
    },
  });

  const metrics = [
    'Revenue Growth',
    'Profit Margins',
    'Cash Flow',
    'ROI',
    'Market Share',
    'Operating Costs',
  ];

  const handleMetricChange = (metric) => {
    setFormData(prev => ({
      ...prev,
      metrics: prev.metrics.includes(metric)
        ? prev.metrics.filter(m => m !== metric)
        : [...prev.metrics, metric]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Analysis Type</label>
        <select
          value={formData.analysisType}
          onChange={(e) => setFormData(prev => ({ ...prev, analysisType: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="market">Market Trend Analysis</option>
          <option value="company">Company-specific Financial Projection</option>
          <option value="investment">Investment Strategy Recommendations</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Industry</label>
        <select
          value={formData.industry}
          onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="technology">Technology</option>
          <option value="healthcare">Healthcare</option>
          <option value="manufacturing">Manufacturing</option>
          <option value="finance">Finance</option>
          <option value="retail">Retail</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Time Frame (months)</label>
        <input
          type="number"
          value={formData.timeFrame}
          onChange={(e) => setFormData(prev => ({ ...prev, timeFrame: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          min="1"
          max="60"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Financial Metrics</label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {metrics.map((metric) => (
            <label key={metric} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={formData.metrics.includes(metric)}
                onChange={() => handleMetricChange(metric)}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-600">{metric}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Inflation Rate (%)</label>
          <input
            type="number"
            step="0.1"
            value={formData.marketConditions.inflation}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              marketConditions: { ...prev.marketConditions, inflation: e.target.value }
            }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Interest Rate (%)</label>
          <input
            type="number"
            step="0.1"
            value={formData.marketConditions.interestRate}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              marketConditions: { ...prev.marketConditions, interestRate: e.target.value }
            }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Generate Report
      </button>
    </form>
  );
};

export default AnalysisForm;