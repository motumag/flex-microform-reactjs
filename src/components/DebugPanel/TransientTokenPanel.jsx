import React from 'react';
import { usePaymentForm } from '../../hooks/usePaymentForm';
import { useDebug } from '../../hooks/useDebug';

const TransientTokenPanel = () => {
  const { 
    transientToken, 
    tokenValidationResponse,
    transientTokenCreated,
    copyToClipboard, 
    copiedField 
  } = usePaymentForm();
  const { logs } = useDebug();

  // Get token creation log details
  const getTokenCreationDetails = () => {
    const tokenLogs = logs.filter(log => 
      log.message === 'Transient token created successfully' && 
      log.data?.details
    );
    return tokenLogs.length > 0 ? tokenLogs[0].data.details : null;
  };

  const tokenDetails = getTokenCreationDetails();

  // Helper function to display token preview
  const displayToken = () => {
    if (!transientToken || typeof transientToken !== 'string') {
      return 'N/A';
    }
    try {
      return transientToken.substring(0, 15) + "...";
    } catch (e) {
      return 'N/A';
    }
  };

  const CopyButton = ({ text, fieldName, label = "Copy" }) => (
    <button 
      onClick={() => copyToClipboard(text, fieldName)}
      className="text-gray-500 hover:text-green-500 focus:outline-none"
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

  if (!transientTokenCreated && !transientToken) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-card border-l-4 border-yellow-500">
      <div className="px-5 py-4 border-b border-gray-200 bg-yellow-50">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-yellow-800 flex items-center">
            <span className="mr-2">🎫</span>
            Transient Token
          </h2>
          <div className="flex items-center space-x-2">
            <span className={`text-sm px-2 py-1 rounded-full ${
              transientTokenCreated ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {transientTokenCreated ? 'Created' : 'Pending'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-5 space-y-4">
        {/* Token Status */}
        {transientToken && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-green-800">✓ Tokenization Successful!</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-green-600">
                  {new Date().toLocaleString()}
                </span>
              </div>
            </div>
            
            {/* Token Preview */}
            <div className="mt-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-green-800">Token (Preview):</span>
                <CopyButton text={transientToken} fieldName="token-preview" label="Copy Full Token" />
              </div>
              <div className="bg-green-100 p-2 rounded border font-mono text-sm text-green-700 break-all">
                {displayToken()}
              </div>
            </div>
          </div>
        )}

        {/* Full Token Details */}
        {transientToken && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Full Token:</span>
              <CopyButton text={transientToken} fieldName="full-token" />
            </div>
            <div className="bg-gray-50 p-3 rounded border font-mono text-xs text-gray-700 break-all max-h-24 overflow-y-auto">
              {transientToken}
            </div>
          </div>
        )}

        {/* Token Metadata */}
        {tokenDetails && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Token Information</h4>
            <div className="bg-gray-50 p-3 rounded border space-y-2">
              {/* Token Length */}
              <div className="flex justify-between text-xs">
                <span>Token Length:</span>
                <span className="font-mono">{transientToken?.length || 0} characters</span>
              </div>
              
              {/* Token Type */}
              {tokenDetails.type && (
                <div className="flex justify-between text-xs">
                  <span>Token Type:</span>
                  <span className="font-mono">{tokenDetails.type}</span>
                </div>
              )}
              
              {/* Creation Time */}
              <div className="flex justify-between text-xs">
                <span>Created:</span>
                <span>{new Date().toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Raw Token Object */}
        {tokenDetails && (
          <div>
            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                <span>Raw Token Object</span>
                <div className="flex items-center space-x-2">
                  <CopyButton 
                    text={JSON.stringify(tokenDetails, null, 2)} 
                    fieldName="raw-token-object" 
                    label="Copy JSON"
                  />
                  <svg className="h-4 w-4 text-gray-500 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>
              <div className="mt-2 bg-gray-100 p-3 rounded max-h-48 overflow-y-auto">
                <pre className="text-xs text-gray-700">
                  {JSON.stringify(tokenDetails, null, 2)}
                </pre>
              </div>
            </details>
          </div>
        )}

        {/* Validation Results */}
        {tokenValidationResponse && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Token Validation</h4>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-blue-800">✓ Validation Complete</span>
                <CopyButton 
                  text={JSON.stringify(tokenValidationResponse, null, 2)} 
                  fieldName="validation-response" 
                  label="Copy Response"
                />
              </div>
              
              {/* JTI Display */}
              {tokenValidationResponse.data?.jti && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-blue-800">JTI (JSON Web Token ID):</span>
                    <CopyButton text={tokenValidationResponse.data.jti} fieldName="jti-value" label="Copy JTI" />
                  </div>
                  <div className="bg-blue-100 p-2 rounded border font-mono text-xs text-blue-700 break-all">
                    {tokenValidationResponse.data.jti}
                  </div>
                </div>
              )}
              
              {/* Card Info */}
              {tokenValidationResponse.data?.cardInfo && (
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  {tokenValidationResponse.data.cardInfo.type && (
                    <div className="bg-blue-100 p-2 rounded">
                      <span className="font-medium">Card Type:</span>
                      <div>{tokenValidationResponse.data.cardInfo.type}</div>
                    </div>
                  )}
                  {tokenValidationResponse.data.cardInfo.brand && (
                    <div className="bg-blue-100 p-2 rounded">
                      <span className="font-medium">Brand:</span>
                      <div>{tokenValidationResponse.data.cardInfo.brand}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Next Step Hint */}
        {transientToken && !tokenValidationResponse && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-xs text-blue-700">
              <span className="font-medium">🎯 Next Step:</span> Click "2. Verify Transient Token" to validate this token and extract the JTI for authentication setup.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransientTokenPanel; 