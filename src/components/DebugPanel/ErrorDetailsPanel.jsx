import React from 'react';
import { useDebug } from '../../hooks/useDebug';
import { usePaymentForm } from '../../hooks/usePaymentForm';

const ErrorDetailsPanel = () => {
  const { errors, logs } = useDebug();
  const { copyToClipboard, copiedField } = usePaymentForm();

  // Get recent errors with details
  const recentErrors = errors.slice(-3);
  const errorLogs = logs.filter(log => log.level === 'error').slice(-5);

  const CopyButton = ({ text, fieldName, label = "Copy" }) => (
    <button 
      onClick={() => copyToClipboard(text, fieldName)}
      className="text-gray-500 hover:text-red-500 focus:outline-none"
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

  if (recentErrors.length === 0 && errorLogs.length === 0) {
    return null; // Don't show panel if no errors
  }

  const formatTimestamp = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleString();
    } catch (e) {
      return timestamp;
    }
  };

  const parseErrorData = (log) => {
    try {
      if (log.data && log.data.details) {
        return log.data.details;
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-card border-l-4 border-red-500">
      <div className="px-5 py-4 border-b border-gray-200 bg-red-50">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-red-800 flex items-center">
            <span className="mr-2">🚨</span>
            Error Details
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-red-600">
              {recentErrors.length + errorLogs.length} error(s)
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-5 space-y-4">
        {/* Recent Error Messages */}
        {recentErrors.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Recent Errors</h4>
            {recentErrors.map((error) => (
              <div key={error.id} className="bg-red-50 border border-red-200 rounded-lg p-3 mb-2">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-red-800">Error Message</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-red-600">
                      {formatTimestamp(error.timestamp)}
                    </span>
                    <CopyButton text={error.message} fieldName={`error-${error.id}`} />
                  </div>
                </div>
                <p className="text-sm text-red-700 break-words">
                  {error.message}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Detailed Error Logs */}
        {errorLogs.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Detailed Error Information</h4>
            {errorLogs.map((log) => {
              const errorDetails = parseErrorData(log);
              return (
                <div key={log.id} className="bg-red-50 border border-red-200 rounded-lg p-4 mb-3">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-medium text-red-800">{log.message}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-red-600">
                        {formatTimestamp(log.timestamp)}
                      </span>
                      <CopyButton 
                        text={JSON.stringify({ message: log.message, data: log.data }, null, 2)} 
                        fieldName={`log-${log.id}`}
                        label="Copy Full Error"
                      />
                    </div>
                  </div>

                  {/* Error Details if available */}
                  {errorDetails && (
                    <div className="space-y-3">
                      {/* Status and Path */}
                      {(errorDetails.status || errorDetails.path) && (
                        <div className="grid grid-cols-2 gap-3">
                          {errorDetails.status && (
                            <div className="bg-red-100 p-2 rounded">
                              <span className="text-xs font-medium text-red-800 block">HTTP Status</span>
                              <span className="text-sm text-red-700">{errorDetails.status}</span>
                            </div>
                          )}
                          {errorDetails.path && (
                            <div className="bg-red-100 p-2 rounded">
                              <span className="text-xs font-medium text-red-800 block">API Path</span>
                              <span className="text-sm text-red-700 font-mono">{errorDetails.path}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Trace ID - Very Important for Support */}
                      {errorDetails.traceId && (
                        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-yellow-800">🔍 Trace ID (For Support)</span>
                            <CopyButton text={errorDetails.traceId} fieldName={`trace-${log.id}`} label="Copy Trace ID" />
                          </div>
                          <code className="text-sm text-yellow-700 font-mono break-all block mt-1">
                            {errorDetails.traceId}
                          </code>
                        </div>
                      )}

                      {/* CyberSource Specific Info */}
                      {(errorDetails.cybersourceId || errorDetails.cybersourceStatus || errorDetails.cybersourceReason) && (
                        <div className="bg-blue-50 border border-blue-200 p-3 rounded">
                          <span className="text-sm font-medium text-blue-800 block mb-2">CyberSource Details</span>
                          <div className="space-y-1 text-xs">
                            {errorDetails.cybersourceId && (
                              <div className="flex justify-between">
                                <span>ID:</span>
                                <span className="font-mono">{errorDetails.cybersourceId}</span>
                              </div>
                            )}
                            {errorDetails.cybersourceStatus && (
                              <div className="flex justify-between">
                                <span>Status:</span>
                                <span className="font-mono">{errorDetails.cybersourceStatus}</span>
                              </div>
                            )}
                            {errorDetails.cybersourceReason && (
                              <div className="flex justify-between">
                                <span>Reason:</span>
                                <span className="font-mono">{errorDetails.cybersourceReason}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Field Errors */}
                      {errorDetails.fieldErrors && Object.keys(errorDetails.fieldErrors).length > 0 && (
                        <div className="bg-orange-50 border border-orange-200 p-3 rounded">
                          <span className="text-sm font-medium text-orange-800 block mb-2">Field Errors</span>
                          <div className="space-y-1 text-xs">
                            {Object.entries(errorDetails.fieldErrors).map(([field, error]) => (
                              <div key={field} className="flex justify-between">
                                <span className="font-medium">{field}:</span>
                                <span>{error}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Timestamp */}
                      {errorDetails.timestamp && (
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="text-xs font-medium text-gray-700 block">Server Timestamp</span>
                          <span className="text-xs text-gray-600">{formatTimestamp(errorDetails.timestamp)}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Raw Error Data (Collapsible) */}
                  <details className="mt-3">
                    <summary className="cursor-pointer text-xs text-red-700 hover:text-red-900">
                      View Raw Error Data
                    </summary>
                    <div className="mt-2 bg-gray-100 p-2 rounded max-h-32 overflow-y-auto">
                      <pre className="text-xs text-gray-700">
                        {JSON.stringify(log.data, null, 2)}
                      </pre>
                    </div>
                  </details>
                </div>
              );
            })}
          </div>
        )}

        {/* Troubleshooting Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h5 className="text-sm font-medium text-blue-800 mb-2">🛠️ Troubleshooting Tips</h5>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• <strong>500 Internal Server Error:</strong> Check if the backend API is running and configured correctly</li>
            <li>• <strong>Trace ID:</strong> Include the trace ID when contacting support for faster resolution</li>
            <li>• <strong>Token Validation Errors:</strong> Ensure the transient token is generated correctly by CyberSource</li>
            <li>• <strong>Network Issues:</strong> Check browser console and network tab for additional details</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ErrorDetailsPanel; 