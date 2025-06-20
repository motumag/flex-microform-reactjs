import React from 'react';
import { usePaymentForm } from '../../hooks/usePaymentForm';

const AuthenticationSetupPanel = () => {
  const { 
    authenticationSetupResponse, 
    copyToClipboard, 
    copiedField,
    currentStep,
    authenticationSetupComplete 
  } = usePaymentForm();

  const CopyButton = ({ text, fieldName, label = "Copy" }) => (
    <button 
      onClick={() => copyToClipboard(text, fieldName)}
      className="text-gray-500 hover:text-primary-500 focus:outline-none"
      title="Copy to clipboard"
      disabled={!text}
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

  const getStatusIcon = () => {
    if (authenticationSetupComplete) {
      return (
        <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    } else if (currentStep === 'auth-setup') {
      return (
        <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      );
    } else {
      return (
        <div className="h-5 w-5 border-2 border-gray-300 rounded-full"></div>
      );
    }
  };

  const getStatusText = () => {
    if (authenticationSetupComplete) {
      return 'Completed';
    } else if (currentStep === 'auth-setup') {
      return 'In Progress';
    } else {
      return 'Pending';
    }
  };

  const getStatusColor = () => {
    if (authenticationSetupComplete) {
      return 'text-green-600';
    } else if (currentStep === 'auth-setup') {
      return 'text-blue-600';
    } else {
      return 'text-gray-500';
    }
  };

  if (!authenticationSetupResponse) {
    return (
      <div className="bg-white rounded-xl shadow-card">
        <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <span className="mr-2">🔐</span>
              Authentication Setup
            </h2>
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <span className={`text-sm font-medium ${getStatusColor()}`}>
                {getStatusText()}
              </span>
            </div>
          </div>
        </div>
        <div className="p-5">
          <div className="text-center text-gray-500 py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-sm">Authentication setup not initiated</p>
            <p className="text-xs text-gray-400 mt-1">Complete token validation to proceed with authentication setup</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-card">
      <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <span className="mr-2">🔐</span>
            Authentication Setup
          </h2>
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-5 space-y-4">
        {/* Status Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-blue-800">Transaction ID</span>
              <CopyButton text={authenticationSetupResponse.id} fieldName="transactionId" />
            </div>
            <p className="text-xs text-blue-700 font-mono mt-1 break-all">
              {authenticationSetupResponse.id}
            </p>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <span className="text-sm font-medium text-green-800 block">Status</span>
            <span className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
              authenticationSetupResponse.status === 'COMPLETED' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {authenticationSetupResponse.status}
            </span>
          </div>
        </div>

        {/* Submit Time */}
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-800">Submit Time (UTC)</span>
            <CopyButton text={authenticationSetupResponse.submitTimeUtc} fieldName="submitTime" />
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {new Date(authenticationSetupResponse.submitTimeUtc).toLocaleString()}
          </p>
        </div>

        {/* Consumer Authentication Information */}
        {authenticationSetupResponse.consumerAuthenticationInformation && (
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Consumer Authentication Information</h4>
            
            <div className="space-y-3">
              {/* Access Token */}
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-green-800">Access Token</span>
                  <CopyButton 
                    text={authenticationSetupResponse.consumerAuthenticationInformation.accessToken} 
                    fieldName="accessToken" 
                    label="Copy Token" 
                  />
                </div>
                <div className="bg-green-100 p-2 rounded">
                  <code className="text-xs break-all block text-green-800 font-mono">
                    {authenticationSetupResponse.consumerAuthenticationInformation.accessToken?.substring(0, 100)}...
                  </code>
                </div>
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-green-700 hover:text-green-900">
                    View Full Token
                  </summary>
                  <div className="mt-1 bg-green-100 p-2 rounded max-h-32 overflow-y-auto">
                    <code className="text-xs break-all block text-green-800 font-mono">
                      {authenticationSetupResponse.consumerAuthenticationInformation.accessToken}
                    </code>
                  </div>
                </details>
              </div>

              {/* Reference ID */}
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-purple-800">Reference ID</span>
                  <CopyButton 
                    text={authenticationSetupResponse.consumerAuthenticationInformation.referenceId} 
                    fieldName="referenceId" 
                    label="Copy ID" 
                  />
                </div>
                <code className="text-xs break-all block text-purple-800 font-mono mt-1">
                  {authenticationSetupResponse.consumerAuthenticationInformation.referenceId}
                </code>
              </div>

              {/* Device Data Collection URL */}
              {authenticationSetupResponse.consumerAuthenticationInformation.deviceDataCollectionUrl && (
                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-yellow-800">Device Data Collection URL</span>
                    <CopyButton 
                      text={authenticationSetupResponse.consumerAuthenticationInformation.deviceDataCollectionUrl} 
                      fieldName="deviceDataUrl" 
                      label="Copy URL" 
                    />
                  </div>
                  <div className="bg-yellow-100 p-2 rounded">
                    <code className="text-xs break-all block text-yellow-800 font-mono">
                      {authenticationSetupResponse.consumerAuthenticationInformation.deviceDataCollectionUrl}
                    </code>
                  </div>
                  <a 
                    href={authenticationSetupResponse.consumerAuthenticationInformation.deviceDataCollectionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-yellow-700 hover:text-yellow-900 underline mt-1 inline-block"
                  >
                    Open in new tab →
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Client Reference Information */}
        {authenticationSetupResponse.clientReferenceInformation && (
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Client Reference Information</h4>
            
            <div className="grid grid-cols-1 gap-3">
              {authenticationSetupResponse.clientReferenceInformation.code && (
                <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-indigo-800">Client Code</span>
                    <CopyButton 
                      text={authenticationSetupResponse.clientReferenceInformation.code} 
                      fieldName="clientCode" 
                    />
                  </div>
                  <code className="text-xs text-indigo-700 font-mono">
                    {authenticationSetupResponse.clientReferenceInformation.code}
                  </code>
                </div>
              )}

              {authenticationSetupResponse.clientReferenceInformation.partner?.developerId && (
                <div className="bg-pink-50 p-3 rounded-lg border border-pink-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-pink-800">Developer ID</span>
                    <CopyButton 
                      text={authenticationSetupResponse.clientReferenceInformation.partner.developerId} 
                      fieldName="developerId" 
                    />
                  </div>
                  <code className="text-xs text-pink-700 font-mono">
                    {authenticationSetupResponse.clientReferenceInformation.partner.developerId}
                  </code>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Full Response Export */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-gray-700">Export Full Response</h4>
            <CopyButton 
              text={JSON.stringify(authenticationSetupResponse, null, 2)} 
              fieldName="fullAuthResponse" 
              label="Copy Full JSON"
            />
          </div>
          
          <details>
            <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
              View Full JSON Response
            </summary>
            <div className="mt-2 bg-gray-50 p-3 rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
              <pre className="text-xs text-gray-700">
                {JSON.stringify(authenticationSetupResponse, null, 2)}
              </pre>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationSetupPanel; 