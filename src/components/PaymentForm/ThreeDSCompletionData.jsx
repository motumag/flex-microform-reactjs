import React, { useState } from 'react';
import { usePaymentForm } from '../../hooks/usePaymentForm';

const ThreeDSCompletionData = () => {
  const { threeDSCompletionData, currentStep, updateThreeDSCompletionData } = usePaymentForm();
  const [manualTransactionId, setManualTransactionId] = useState('');

  const handleManualInput = () => {
    if (manualTransactionId.trim()) {
      const manualData = {
        receivedFormParams: {
          TransactionId: manualTransactionId.trim(),
          Response: '',
          MD: 'cybersource_3ds_challenge_data'
        },
        timestamp: new Date().toISOString(),
        source: 'manual_input'
      };
      
      updateThreeDSCompletionData(manualData);
      setManualTransactionId('');
    }
  };

  // Show manual input if we're in 3DS challenge or completion step
  const showManualInput = (currentStep === 'complete' && !threeDSCompletionData) || 
                         currentStep === '3ds-complete';

  // Show completion data if we have it
  const showCompletionData = threeDSCompletionData && currentStep === '3ds-complete';

  if (!showManualInput && !showCompletionData) {
    return null;
  }

  // Show manual input form if no completion data yet
  if (showManualInput && !showCompletionData) {
    return (
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg overflow-hidden">
        <div className="bg-blue-100 border-b border-blue-200 px-4 py-3">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <h3 className="text-lg font-semibold text-blue-800">Manual 3DS Completion Data</h3>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            Enter the TransactionId from your server response to continue with payment processing.
          </p>
        </div>
        
        <div className="p-6">
          <div className="flex space-x-3">
            <input
              type="text"
              value={manualTransactionId}
              onChange={(e) => setManualTransactionId(e.target.value)}
              placeholder="Enter TransactionId (e.g., Be1SywFxD8CKfsde0jY0)"
              className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <button
              onClick={handleManualInput}
              disabled={!manualTransactionId.trim()}
              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors"
            >
              ✅ Add Data
            </button>
          </div>
          
          <div className="mt-3 text-xs text-blue-600">
            💡 Copy the TransactionId from your server logs and paste it here to proceed with payment processing.
          </div>
        </div>
      </div>
    );
  }

  const handleUseForNextCall = () => {
    console.log('🔐 Using 3DS completion data for next API call:', threeDSCompletionData);
    
    // Example: You can now use the TransactionId for your next API call
    const transactionId = threeDSCompletionData.receivedFormParams?.TransactionId || 
                         threeDSCompletionData.TransactionId;
    
    if (transactionId) {
      // Example API call using the TransactionId
      const nextApiCall = {
        method: 'POST',
        url: 'http://localhost:8081/api/v1/process-payment',
        body: {
          threeDSTransactionId: transactionId,
          merchantData: threeDSCompletionData.receivedFormParams?.MD,
          // Add other required fields for your payment processing
        }
      };
      
      console.log('🚀 Next API call configuration:', nextApiCall);
      
      // You can dispatch this to your payment processing function
      // or call your payment API directly here
    }
  };

  const copyTransactionId = () => {
    const transactionId = threeDSCompletionData.receivedFormParams?.TransactionId || 
                         threeDSCompletionData.TransactionId;
    if (transactionId) {
      navigator.clipboard.writeText(transactionId);
    }
  };

  return (
    <div className="mt-6 bg-green-50 border border-green-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-green-100 border-b border-green-200 px-4 py-3">
        <div className="flex items-center">
          <svg className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-green-800">3D Secure Challenge Completed</h3>
        </div>
        <p className="text-sm text-green-700 mt-1">
          Challenge completion data captured and ready for use in subsequent API calls.
        </p>
      </div>

      {/* Completion Data */}
      <div className="p-6">
        {/* Key Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {threeDSCompletionData.receivedFormParams?.TransactionId && (
            <div className="bg-white p-3 rounded-lg border border-green-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-green-800">Transaction ID</span>
                <button
                  onClick={copyTransactionId}
                  className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                >
                  Copy
                </button>
              </div>
              <div className="text-sm text-green-700 font-mono mt-1">
                {threeDSCompletionData.receivedFormParams.TransactionId}
              </div>
            </div>
          )}
          
          {threeDSCompletionData.receivedFormParams?.MD && (
            <div className="bg-white p-3 rounded-lg border border-green-200">
              <span className="text-sm font-medium text-green-800 block">Merchant Data</span>
              <div className="text-sm text-green-700 font-mono mt-1">
                {threeDSCompletionData.receivedFormParams.MD}
              </div>
            </div>
          )}
        </div>

        {/* Response Status */}
        <div className="bg-white p-3 rounded-lg border border-green-200 mb-4">
          <span className="text-sm font-medium text-green-800 block mb-2">Challenge Response</span>
          <div className="text-sm text-green-700">
            {threeDSCompletionData.receivedFormParams?.Response === '' ? (
              <span className="text-green-600 font-medium">✅ Success (Empty response indicates successful authentication)</span>
            ) : (
              <span className="text-yellow-600">⚠️ Response: {threeDSCompletionData.receivedFormParams?.Response || 'Unknown'}</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleUseForNextCall}
            className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            🚀 Use for Payment Processing
          </button>
          
          <button
            onClick={() => console.log('Full 3DS data:', threeDSCompletionData)}
            className="py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            📋 View Full Data
          </button>
        </div>

        {/* Raw Data (Development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 bg-gray-900 text-green-400 p-3 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Raw Completion Data (Development Only)</h4>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(threeDSCompletionData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreeDSCompletionData; 