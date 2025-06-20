import React from 'react';
import { usePaymentForm } from '../../hooks/usePaymentForm';
import { useDebug } from '../../hooks/useDebug';

const StatusMessages = ({ error }) => {
  const { 
    transientToken, 
    tokenValidationResponse, 
    authenticationSetupResponse,
    currentStep,
    captureContextLoaded,
    transientTokenCreated,
    tokenValidated,
    authenticationSetupComplete,
    getDisplayToken,
    copyToClipboard 
  } = usePaymentForm();
  const { debugStatus, logs } = useDebug();

  // Extract trace ID from recent error logs
  const getTraceIdFromRecentError = () => {
    const recentErrorLogs = logs.filter(log => log.level === 'error').slice(-1);
    if (recentErrorLogs.length > 0) {
      const log = recentErrorLogs[0];
      if (log.data?.details?.traceId) {
        return log.data.details.traceId;
      }
    }
    return null;
  };

  // Show error messages
  if (error) {
    const traceId = getTraceIdFromRecentError();
    
    return (
      <div className="mx-5 mt-4 bg-red-50 text-red-700 p-3 rounded-lg border border-red-200 text-sm">
        <div className="flex">
          <svg className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="flex-1">
            <div><strong>Error:</strong> {error}</div>
            
            {/* Show trace ID if available */}
            {traceId && (
              <div className="mt-2 p-2 bg-red-100 rounded border">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium">🔍 Trace ID (for support):</span>
                  <button 
                    onClick={() => copyToClipboard(traceId, 'error-trace-id')}
                    className="text-xs text-red-600 hover:text-red-800 underline"
                  >
                    Copy
                  </button>
                </div>
                <code className="text-xs break-all block mt-1 font-mono text-red-800">
                  {traceId}
                </code>
              </div>
            )}
            
            {!debugStatus.apiConnected && (
              <div className="mt-1 text-xs">
                <strong>Possible solution:</strong> Make sure your API server is running at http://localhost:8081
              </div>
            )}
            
            <div className="mt-2 text-xs">
              <strong>💡 Tip:</strong> Check the "Error Details" panel below for more information
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show processing steps
  const getStepIcon = (stepCompleted, isCurrentStep) => {
    if (stepCompleted) {
      return (
        <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    } else if (isCurrentStep) {
      return (
        <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      );
    } else {
      return (
        <div className="h-4 w-4 border-2 border-gray-300 rounded-full"></div>
      );
    }
  };

  const steps = [
    { 
      key: 'capture-context', 
      label: 'Capture Context', 
      completed: captureContextLoaded,
      isCurrentStep: currentStep === 'capture-context'
    },
    { 
      key: 'token-creation', 
      label: 'Token Creation', 
      completed: transientTokenCreated,
      isCurrentStep: currentStep === 'token-creation'
    },
    { 
      key: 'token-validation', 
      label: 'Token Validation', 
      completed: tokenValidated,
      isCurrentStep: currentStep === 'token-validation'
    },
    { 
      key: 'auth-setup', 
      label: 'Authentication Setup', 
      completed: authenticationSetupComplete,
      isCurrentStep: currentStep === 'auth-setup'
    }
  ];

  const showProgressSteps = currentStep !== 'idle' && currentStep !== 'token-created' && currentStep !== 'token-verified' && !authenticationSetupComplete;
  const showSuccessMessage = authenticationSetupComplete && authenticationSetupResponse;

  return (
    <div className="mx-5 mt-4 space-y-3">
      {/* Progress Steps */}
      {showProgressSteps && (
        <div className="bg-blue-50 text-blue-700 p-3 rounded-lg border border-blue-200 text-sm">
          <div className="flex items-center mb-2">
            <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <strong>Processing Payment</strong>
          </div>
          <div className="space-y-2">
            {steps.map((step) => (
              <div key={step.key} className="flex items-center space-x-2">
                {getStepIcon(step.completed, step.isCurrentStep)}
                <span className={`text-xs ${step.completed ? 'text-green-700' : step.isCurrentStep ? 'text-blue-700' : 'text-gray-500'}`}>
                  {step.label}
                  {step.isCurrentStep && !step.completed && ' (Processing...)'}
                  {step.completed && ' ✓'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success Message with Authentication Details */}
      {showSuccessMessage && (
        <div className="bg-green-50 text-green-700 p-3 rounded-lg border border-green-200 text-sm">
          <div className="flex">
            <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div className="flex-1">
              <div className="font-semibold mb-2">Payment Authentication Successful!</div>
              
              <div className="space-y-1 text-xs">
                <div>
                  <strong>Transaction ID:</strong> {authenticationSetupResponse.id}
                </div>
                <div>
                  <strong>Status:</strong> {authenticationSetupResponse.status}
                </div>
                <div>
                  <strong>Reference ID:</strong> {authenticationSetupResponse.consumerAuthenticationInformation?.referenceId}
                </div>
                <div>
                  <strong>Submit Time:</strong> {new Date(authenticationSetupResponse.submitTimeUtc).toLocaleString()}
                </div>
              </div>

              {authenticationSetupResponse.consumerAuthenticationInformation?.deviceDataCollectionUrl && (
                <div className="mt-2 p-2 bg-green-100 rounded border">
                  <div className="text-xs">
                    <strong>Device Data Collection URL:</strong>
                    <div className="break-all mt-1">
                      {authenticationSetupResponse.consumerAuthenticationInformation.deviceDataCollectionUrl}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Token Information (for debugging) */}
      {transientToken && !authenticationSetupComplete && (
        <div className="bg-yellow-50 text-yellow-700 p-3 rounded-lg border border-yellow-200 text-sm">
          <div className="flex">
            <svg className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <strong>Transient Token Created</strong>
              <p className="mt-1 text-xs">
                <strong>Token:</strong> {getDisplayToken()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusMessages; 