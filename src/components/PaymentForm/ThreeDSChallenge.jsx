import React, { useEffect, useRef } from 'react';
import { usePaymentForm } from '../../hooks/usePaymentForm';
import { useDispatch } from 'react-redux';
import { addLog } from '../../store/slices/debugSlice';

const ThreeDSChallenge = () => {
  const { enrollmentCheckResponse, enrollmentCheckComplete, updateCurrentStep, updateThreeDSCompletionData } = usePaymentForm();
  const dispatch = useDispatch();
  const formRef = useRef(null);
  const iframeRef = useRef(null);

  // Check if we need to show the 3DS challenge
  // According to docs, we need accessToken (JWT) for the challenge
  const shouldShowChallenge = enrollmentCheckComplete && 
    enrollmentCheckResponse?.status === 'PENDING_AUTHENTICATION' &&
    enrollmentCheckResponse?.consumerAuthenticationInformation?.accessToken &&
    enrollmentCheckResponse?.consumerAuthenticationInformation?.stepUpUrl;

  // Check if challenge is actually required
  const challengeRequired = enrollmentCheckResponse?.consumerAuthenticationInformation?.challengeRequired === 'Y';

  // Debug logging
  console.log('🔍 ThreeDSChallenge Debug:', {
    enrollmentCheckComplete,
    enrollmentCheckResponse,
    status: enrollmentCheckResponse?.status,
    challengeRequired,
    hasAccessToken: !!enrollmentCheckResponse?.consumerAuthenticationInformation?.accessToken,
    hasStepUpUrl: !!enrollmentCheckResponse?.consumerAuthenticationInformation?.stepUpUrl,
    shouldShowChallenge,
    consumerAuthInfo: enrollmentCheckResponse?.consumerAuthenticationInformation
  });

  useEffect(() => {
    if (shouldShowChallenge && formRef.current) {
      console.log('🔐 Starting 3D Secure Challenge...');
      console.log('- Auth Token (accessToken):', enrollmentCheckResponse.consumerAuthenticationInformation.accessToken);
      console.log('- Auth Token (token):', enrollmentCheckResponse.consumerAuthenticationInformation.token);
      console.log('- Using Token:', authToken);
      console.log('- Step Up URL:', enrollmentCheckResponse.consumerAuthenticationInformation.stepUpUrl);
      
      // Set up message listener for 3DS challenge completion
      const messageHandler = (event) => {
        console.log('🔐 3DS Challenge message received:', {
          origin: event.origin,
          data: event.data,
          dataType: typeof event.data,
          source: event.source,
          fullEvent: event
        });
        
        // Only accept messages from trusted Cardinal Commerce domains or localhost (for development)
        const trustedOrigins = [
          'https://centinelapistag.cardinalcommerce.com',
          'https://centinelapi.cardinalcommerce.com',
          'https://0merchantacsstag.cardinalcommerce.com',
          'http://localhost:3000', // Allow localhost for development
          'https://localhost:3000'
        ];
        
        if (!trustedOrigins.includes(event.origin)) {
          console.log('🔐 Ignoring message from untrusted origin:', event.origin);
          return;
        }
        
        // Handle different types of 3DS completion messages
        if (event.data && typeof event.data === 'object') {
          console.log('🔐 Processing object message:', event.data);
          
          // Check for Cardinal Commerce or CyberSource 3DS completion
          if (event.data.Status === 'SUCCESS' || 
              event.data.status === 'SUCCESS' ||
              event.data.ActionCode === 'SUCCESS' ||
              event.data.type === '3dsMethodFinished' ||
              event.data.MessageType === 'profile.completed' ||
              event.data.validated === true ||
              event.data.success === true) {
            
            console.log('✅ 3D Secure Challenge completed successfully:', event.data);
            
            // Store the completion data for further API calls
            updateThreeDSCompletionData(event.data);
            
            // Log the completion data
            dispatch(addLog({
              level: 'success',
              message: '3D Secure Challenge completed successfully',
              data: event.data
            }));
            
            // Update the current step to complete
            updateCurrentStep('complete');
            
            // Clean up the message listener
            window.removeEventListener('message', messageHandler);
            return;
          } 
          
          if (event.data.Status === 'FAILURE' || 
              event.data.status === 'FAILURE' ||
              event.data.ActionCode === 'FAILURE' ||
              event.data.error === true) {
            
            console.error('❌ 3D Secure Challenge failed:', event.data);
            // You might want to handle failure differently
            return;
          }
          
          // Check for specific Cardinal Commerce message types
          if (event.data.MessageType) {
            console.log('🔐 Cardinal Commerce message type:', event.data.MessageType);
            if (event.data.MessageType === 'profile.completed' || 
                event.data.MessageType === 'authentication.completed') {
              console.log('✅ 3D Secure Challenge completed via MessageType:', event.data);
              updateCurrentStep('complete');
              window.removeEventListener('message', messageHandler);
              return;
            }
          }
        }
        
        // Also handle string messages
        if (typeof event.data === 'string') {
          console.log('🔐 Processing string message:', event.data);
          try {
            const parsedData = JSON.parse(event.data);
            console.log('🔐 Parsed string data:', parsedData);
            if (parsedData.Status === 'SUCCESS' || parsedData.status === 'SUCCESS') {
              console.log('✅ 3D Secure Challenge completed (parsed):', parsedData);
              updateCurrentStep('complete');
              window.removeEventListener('message', messageHandler);
              return;
            }
          } catch (e) {
            // Not JSON, might be a simple success message
            console.log('🔐 String message (not JSON):', event.data);
            if (event.data.toLowerCase().includes('success') || 
                event.data.toLowerCase().includes('complete') ||
                event.data.toLowerCase().includes('authenticated')) {
              console.log('✅ 3D Secure Challenge completed (string):', event.data);
              updateCurrentStep('complete');
              window.removeEventListener('message', messageHandler);
              return;
            }
          }
        }
        
        console.log('🔐 Message not recognized as completion signal');
      };
      
      // Add the message listener
      window.addEventListener('message', messageHandler, false);
      
      // Auto-submit the form after a small delay to ensure iframe is ready
      setTimeout(() => {
        if (formRef.current) {
          console.log('🚀 Submitting 3DS challenge form...');
          
          // Log form data for debugging
          const formData = new FormData(formRef.current);
          const formParams = {};
          for (let [key, value] of formData.entries()) {
            formParams[key] = value;
          }
          console.log('🔐 Form parameters:', formParams);
          console.log('🔐 Form action:', formRef.current.action);
          console.log('🔐 Form method:', formRef.current.method);
          
          formRef.current.submit();
        }
      }, 100);
      
      // Cleanup function
      return () => {
        window.removeEventListener('message', messageHandler);
      };
    }
  }, [shouldShowChallenge, enrollmentCheckResponse, updateCurrentStep]);

  // Show special message if challenge is not required AND no accessToken
  if (enrollmentCheckComplete && 
      enrollmentCheckResponse?.status === 'PENDING_AUTHENTICATION' && 
      !challengeRequired && 
      !enrollmentCheckResponse?.consumerAuthenticationInformation?.accessToken) {
    return (
      <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center mb-3">
          <svg className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h3 className="text-lg font-semibold text-green-800">3D Secure Authentication Complete</h3>
        </div>
        
        <div className="text-sm text-green-700 space-y-2">
          <p><strong>Status:</strong> {enrollmentCheckResponse.status}</p>
          <p><strong>Challenge Required:</strong> No</p>
          <p><strong>VERES Enrolled:</strong> {enrollmentCheckResponse.consumerAuthenticationInformation.veresEnrolled}</p>
          <p><strong>PARES Status:</strong> {enrollmentCheckResponse.consumerAuthenticationInformation.paresStatus}</p>
          
          <div className="mt-3 p-3 bg-green-100 rounded border">
            <p className="font-medium mb-2">Authentication Details:</p>
            <div className="text-xs space-y-1">
              <div><strong>Transaction ID:</strong> {enrollmentCheckResponse.consumerAuthenticationInformation.authenticationTransactionId}</div>
              <div><strong>3DS Server Transaction ID:</strong> {enrollmentCheckResponse.consumerAuthenticationInformation.threeDSServerTransactionId}</div>
              <div><strong>ACS Transaction ID:</strong> {enrollmentCheckResponse.consumerAuthenticationInformation.acsTransactionId}</div>
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => {
              console.log('🔐 3DS authentication complete (no challenge required)');
              updateCurrentStep('complete');
            }}
            className="w-full mt-3 py-2 px-3 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            ✅ Continue - Authentication Complete
          </button>
        </div>
      </div>
    );
  }

  // Show debugging info if we have PENDING_AUTHENTICATION but can't show challenge
  if (enrollmentCheckComplete && enrollmentCheckResponse?.status === 'PENDING_AUTHENTICATION' && !shouldShowChallenge) {
    return (
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center mb-3">
          <svg className="h-5 w-5 text-yellow-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-lg font-semibold text-yellow-800">3D Secure Challenge Debug</h3>
        </div>
        
        <div className="text-sm text-yellow-700 space-y-2">
          <p><strong>Status:</strong> {enrollmentCheckResponse.status}</p>
          <p><strong>Enrollment Complete:</strong> {enrollmentCheckComplete ? 'Yes' : 'No'}</p>
          <p><strong>Has Access Token (required for challenge):</strong> {enrollmentCheckResponse?.consumerAuthenticationInformation?.accessToken ? 'Yes' : 'No'}</p>
          <p><strong>Has Token:</strong> {enrollmentCheckResponse?.consumerAuthenticationInformation?.token ? 'Yes' : 'No'}</p>
          <p><strong>Has Step Up URL:</strong> {enrollmentCheckResponse?.consumerAuthenticationInformation?.stepUpUrl ? 'Yes' : 'No'}</p>
          <p><strong>Challenge Required:</strong> {enrollmentCheckResponse?.consumerAuthenticationInformation?.challengeRequired}</p>
          
          <div className="mt-3 p-3 bg-yellow-100 rounded border">
            <p className="font-medium text-yellow-800">Issue:</p>
            <p className="text-xs">The enrollment response has status PENDING_AUTHENTICATION but is missing the accessToken (JWT) required for the 3DS challenge iframe. According to CyberSource documentation, the accessToken field should contain the JWT needed for the challenge.</p>
          </div>
          
          {enrollmentCheckResponse?.consumerAuthenticationInformation && (
            <div className="mt-3 p-3 bg-yellow-100 rounded border">
              <p className="font-medium mb-2">Consumer Authentication Information:</p>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(enrollmentCheckResponse.consumerAuthenticationInformation, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!shouldShowChallenge) {
    return null;
  }

  const { accessToken, token, stepUpUrl, pareq } = enrollmentCheckResponse.consumerAuthenticationInformation;
  const authToken = accessToken || token;
  
  // Decode pareq JWT to get challenge window size
  let challengeWindowSize = '02'; // Default to 390x400
  let iframeWidth = 390;
  let iframeHeight = 400;
  
  if (pareq) {
    try {
      // Decode JWT payload (second part of JWT)
      const payload = JSON.parse(atob(pareq.split('.')[1]));
      console.log('🔐 Decoded pareq payload:', payload);
      
      if (payload.challengeWindowSize) {
        challengeWindowSize = payload.challengeWindowSize;
        
        // Set iframe dimensions based on challenge window size
        switch (challengeWindowSize) {
          case '01':
            iframeWidth = 250;
            iframeHeight = 400;
            break;
          case '02':
            iframeWidth = 390;
            iframeHeight = 400;
            break;
          case '03':
            iframeWidth = 500;
            iframeHeight = 600;
            break;
          case '04':
            iframeWidth = 600;
            iframeHeight = 400;
            break;
          case '05':
            // Full screen - use viewport dimensions
            iframeWidth = window.innerWidth - 100;
            iframeHeight = window.innerHeight - 200;
            break;
          default:
            iframeWidth = 390;
            iframeHeight = 400;
        }
        
        console.log('🔐 Challenge window size:', challengeWindowSize, `(${iframeWidth}x${iframeHeight})`);
      }
    } catch (error) {
      console.error('🔐 Error decoding pareq JWT:', error);
    }
  }

  return (
    <div className="mt-6 bg-white border border-orange-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-orange-50 border-b border-orange-200 px-4 py-3">
        <div className="flex items-center">
          <svg className="h-5 w-5 text-orange-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h3 className="text-lg font-semibold text-orange-800">3D Secure Authentication Required</h3>
        </div>
        <p className="text-sm text-orange-700 mt-1">
          Please complete the authentication challenge below to proceed with your payment.
        </p>
      </div>

      {/* Challenge Container */}
      <div className="p-6">
        <div className="flex justify-center items-center">
          <div className="border border-gray-300 rounded-lg overflow-hidden shadow-lg">
            {/* Step-Up Iframe */}
            <iframe
              ref={iframeRef}
              name="step-up-iframe"
              width={iframeWidth}
              height={iframeHeight}
              style={{ border: 'none' }}
              title="3D Secure Challenge"
              onLoad={() => {
                console.log('🔐 3DS Challenge iframe loaded');
              }}
            />
          </div>
        </div>

        {/* Hidden Challenge Form */}
        <form
          ref={formRef}
          id="step-up-form"
          target="step-up-iframe"
          method="post"
          action={stepUpUrl}
          style={{ display: 'none' }}
        >
          {/* JWT parameter - use accessToken from enrollment response */}
          <input
            type="hidden"
            name="JWT"
            value={accessToken}
          />
          
          {/* Merchant Data - optional custom data returned after challenge */}
          <input
            type="hidden"
            name="MD"
            value="cybersource_3ds_challenge_data"
          />
        </form>

        {/* Challenge Info */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Challenge Details</h4>
          <div className="space-y-2 text-xs text-blue-700">
            <div>
              <span className="font-medium">Status:</span> {enrollmentCheckResponse.status}
            </div>
            <div>
              <span className="font-medium">VERES Enrolled:</span> {enrollmentCheckResponse.consumerAuthenticationInformation.veresEnrolled}
            </div>
            <div>
              <span className="font-medium">Challenge Required:</span> {enrollmentCheckResponse.consumerAuthenticationInformation.challengeRequired}
            </div>
            <div>
              <span className="font-medium">Transaction ID:</span> {enrollmentCheckResponse.consumerAuthenticationInformation.authenticationTransactionId}
            </div>
            <div>
              <span className="font-medium">3DS Server Transaction ID:</span> {enrollmentCheckResponse.consumerAuthenticationInformation.threeDSServerTransactionId}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-800 mb-2">Instructions</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Complete the authentication challenge in the frame above</li>
            <li>• Follow the prompts from your card issuer</li>
            <li>• You may be asked to enter an SMS code or use your banking app</li>
            <li>• Once completed, the system should automatically continue</li>
            <li>• If automatic completion doesn't work, click the button below</li>
          </ul>
          
          {/* Manual completion button */}
          <div className="mt-3">
            <button
              type="button"
              onClick={() => {
                console.log('🔐 Manual 3DS challenge completion triggered');
                updateCurrentStep('complete');
              }}
              className="w-full py-2 px-3 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              ✅ I've Completed the Challenge
            </button>
          </div>
        </div>

        {/* Debug Info (Development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 bg-gray-900 text-green-400 p-3 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Debug Info (Development Only)</h4>
            <div className="text-xs space-y-1 font-mono">
              <div>Step Up URL: {stepUpUrl}</div>
              <div>Access Token: {accessToken ? accessToken.substring(0, 50) + '...' : 'Not available'}</div>
              <div>Challenge Window Size: {challengeWindowSize} ({iframeWidth}x{iframeHeight})</div>
              <div>PaReq Available: {pareq ? 'Yes' : 'No'}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreeDSChallenge; 