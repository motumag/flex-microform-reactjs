import React from 'react';
import { usePaymentForm } from '../../hooks/usePaymentForm';

const ConfigurationDisplay = () => {
  const { flexConfig, copyToClipboard, copiedField } = usePaymentForm();

  const CopyButton = ({ text, fieldName, label = "Copy" }) => (
    <button 
      onClick={() => copyToClipboard(text, fieldName)}
      className="text-gray-500 hover:text-primary-500 focus:outline-none"
      disabled={!text}
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

  const configItems = [
    {
      label: 'Client Library',
      value: flexConfig?.clientLibrary,
      fieldName: 'clientLibrary',
      isLong: true
    },
    {
      label: 'Client Library Integrity',
      value: flexConfig?.clientLibraryIntegrity,
      fieldName: 'clientLibraryIntegrity',
      isLong: true
    },
    {
      label: 'Capture Context',
      value: flexConfig?.captureContext,
      fieldName: 'captureContext',
      isLong: true,
      maxHeight: 'max-h-36'
    }
  ];

  return (
    <div className="mt-4">
      <h4 className="font-semibold text-gray-700 mb-1">SDK Configuration</h4>
      <div className="bg-gray-50 p-2 rounded-md border border-gray-200 overflow-x-auto">
        <div className="flex flex-col gap-2">
          {configItems.map((item) => (
            <div key={item.fieldName}>
              <div className="flex items-center justify-between">
                <span className="font-medium text-xs">{item.label}:</span>
                <CopyButton 
                  text={item.value} 
                  fieldName={item.fieldName}
                  label="Copy"
                />
              </div>
              <div className={`mt-1 p-1 bg-gray-100 rounded overflow-x-auto ${item.maxHeight || ''} overflow-y-auto`}>
                <code className="text-[10px] break-all block">
                  {typeof item.value === 'string' ? item.value : 'Not available'}
                </code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConfigurationDisplay; 