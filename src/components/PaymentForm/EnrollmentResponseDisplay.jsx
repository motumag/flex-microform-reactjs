import React, { useState } from 'react';
import { usePaymentForm } from '../../hooks/usePaymentForm';

const EnrollmentResponseDisplay = () => {
  const { enrollmentCheckResponse, enrollmentCheckComplete } = usePaymentForm();
  const [copied, setCopied] = useState(false);

  if (!enrollmentCheckComplete || !enrollmentCheckResponse) {
    return null;
  }

  const copyToClipboard = async () => {
    try {
      const jsonString = JSON.stringify(enrollmentCheckResponse, null, 2);
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="mt-6 bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-green-50 border-b border-green-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-green-800">Enrollment Response</h3>
          </div>
          <button
            type="button"
            onClick={copyToClipboard}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              copied 
                ? 'bg-green-600 text-white' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {copied ? '✓ Copied!' : 'Copy Response'}
          </button>
        </div>
      </div>

      {/* JSON Response */}
      <div className="p-4">
        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre-wrap">
          {JSON.stringify(enrollmentCheckResponse, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default EnrollmentResponseDisplay; 