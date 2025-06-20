import React from 'react';
import { usePaymentForm } from '../../hooks/usePaymentForm';
import { useDebug } from '../../hooks/useDebug';

const ApiStatus = () => {
  const { copyToClipboard, copiedField } = usePaymentForm();
  const { debugStatus } = useDebug();

  const CopyButton = ({ text, fieldName, label = "Copy" }) => (
    <button 
      onClick={() => copyToClipboard(text, fieldName)}
      className="ml-1 text-gray-500 hover:text-primary-500 focus:outline-none"
      title="Copy to clipboard"
    >
      {copiedField === fieldName ? (
        <span className="text-xs text-green-500 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Copied!
        </span>
      ) : (
        <span className="text-xs flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
          </svg>
          {label}
        </span>
      )}
    </button>
  );

  return (
    <div className="mt-4">
      <h4 className="font-semibold text-gray-700 mb-1">API Status</h4>
      <div className="bg-gray-50 p-2 rounded-md border border-gray-200 flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <span>Backend API:</span>
          <div className="flex items-center">
            <span className={debugStatus.apiConnected ? "text-green-600" : "text-red-600"}>
              http://localhost:8081
            </span>
            <CopyButton text="http://localhost:8081" fieldName="backendApi" />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span>Last API Call:</span>
          <div className="flex items-center">
            <span>{debugStatus.lastApiCall || 'None'}</span>
            {debugStatus.lastApiCall && (
              <CopyButton text={debugStatus.lastApiCall} fieldName="lastApiCall" />
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span>Network Status:</span>
          <span className={`px-1 py-0.5 rounded text-xs ${
            debugStatus.networkStatus === 'success' ? 'bg-green-100 text-green-800' :
            debugStatus.networkStatus === 'error' ? 'bg-red-100 text-red-800' :
            debugStatus.networkStatus === 'loading' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {debugStatus.networkStatus}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ApiStatus; 