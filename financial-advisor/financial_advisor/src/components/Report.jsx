import React from 'react';

const Report = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Financial Analysis Report</h2>
        <p className="text-sm text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Analysis Parameters</h3>
          <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Industry:</span> {data.industry}
            </div>
            <div>
              <span className="font-medium">Time Frame:</span> {data.timeFrame} months
            </div>
            <div>
              <span className="font-medium">Analysis Type:</span> {data.analysisType}
            </div>
            <div>
              <span className="font-medium">Inflation Rate:</span> {data.marketConditions.inflation}%
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900">Selected Metrics</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {data.metrics.map((metric) => (
              <span
                key={metric}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
              >
                {metric}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900">Market Conditions</h3>
          <div className="mt-2 prose prose-sm text-gray-600">
            <p>
              Based on the provided inflation rate of {data.marketConditions.inflation}% and interest rate of{' '}
              {data.marketConditions.interestRate}%, the market conditions suggest...
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900">Key Insights</h3>
          <div className="mt-2 space-y-2">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-green-700">
                Positive Outlook: The {data.industry} sector shows promising growth potential over the next{' '}
                {data.timeFrame} months.
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-yellow-700">
                Watch Points: Monitor market volatility and adjust strategies accordingly.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900">Recommendations</h3>
          <ul className="mt-2 list-disc list-inside text-gray-600 space-y-2">
            <li>Diversify investment portfolio across multiple sub-sectors</li>
            <li>Maintain cash reserves of 20-30% for potential opportunities</li>
            <li>Review and adjust strategy quarterly based on market conditions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Report;