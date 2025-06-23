import React from 'react';
import { usePaymentForm } from '../../hooks/usePaymentForm';
import { useMicroform } from '../../hooks/useMicroform';

const PaymentButton = () => {
  const {
    currentStep,
    transientToken,
    tokenValidationResponse,
    authenticationSetupResponse,
    authenticationSetupComplete,
    deviceCollectionComplete,
    enrollmentCheckComplete,
    processingPayment,
    transientTokenCreated,
    tokenValidated,
  } = usePaymentForm();

  const {
    createTransientToken,
    verifyTransientTokenManually,
    setupAuthenticationManually,
    startEnrollmentCheck,
    isCheckingEnrollment,
    skipDeviceDataCollection,
  } = useMicroform();

  // Safe check for microform ready
  const microformReady = React.useMemo(() => {
    try {
      return !!document.getElementById("number-container")?.querySelector("iframe");
    } catch (error) {
      console.warn("Error checking microform ready:", error);
      return false;
    }
  }, []);

  // Safe property access with error handling
  const safeGetReferenceId = React.useMemo(() => {
    try {
      return authenticationSetupResponse?.consumerAuthenticationInformation?.referenceId;
    } catch (error) {
      console.warn("Error accessing reference ID:", error);
      return null;
    }
  }, [authenticationSetupResponse]);

  const safeGetJTI = React.useMemo(() => {
    try {
      return tokenValidationResponse?.data?.jti;
    } catch (error) {
      console.warn("Error accessing JTI:", error);
      return null;
    }
  }, [tokenValidationResponse]);

  // Determine which buttons to show based on current step
  const showCreateTokenButton = !transientTokenCreated && !transientToken && currentStep !== 'token-creation';
  const showVerifyTokenButton = (transientTokenCreated || transientToken) && !tokenValidated && currentStep !== 'token-validation';
  const showSetupAuthButton = tokenValidated && !authenticationSetupComplete && currentStep !== 'auth-setup';
  const showEnrollmentCheckButton = authenticationSetupComplete && deviceCollectionComplete && !enrollmentCheckComplete;

  // Debug info for troubleshooting
  React.useEffect(() => {
    try {
      console.log('🔘 Button State Update:', {
        currentStep,
        authenticationSetupComplete,
        deviceCollectionComplete,
        enrollmentCheckComplete,
        showEnrollmentCheckButton,
        microformReady,
        processingPayment,
        transientToken: transientToken ? `EXISTS (${transientToken.length} chars)` : 'NULL',
        transientTokenCreated,
        tokenValidated,
        showVerifyTokenButton,
        showCreateTokenButton,
        // More detailed debug info
        transientTokenType: typeof transientToken,
        buttonLogic: {
          hasToken: !!(transientTokenCreated || transientToken),
          notValidated: !tokenValidated,
          notValidating: currentStep !== 'token-validation',
          shouldShow: (transientTokenCreated || transientToken) && !tokenValidated && currentStep !== 'token-validation'
        }
      });
    } catch (error) {
      console.error('Error in debug logging:', error);
    }
  }, [currentStep, authenticationSetupComplete, deviceCollectionComplete, enrollmentCheckComplete, showEnrollmentCheckButton, microformReady, processingPayment, transientToken, transientTokenCreated, tokenValidated, showVerifyTokenButton, showCreateTokenButton]);

  const LoadingSpinner = () => (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  const CheckIcon = () => (
    <svg className="mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );

    // Error handling wrapper
  try {
    if (enrollmentCheckComplete) {
      return (
        <div className="mt-6">
          <button
            disabled
            className="w-full py-3 px-4 text-white font-medium rounded-lg bg-green-600 cursor-default text-sm flex items-center justify-center"
          >
            <CheckIcon />
            ✓ Payment Flow Complete - Ready for Authorization
          </button>
        </div>
      );
    }

    return (
      <div className="mt-6 space-y-3">
        {/* Debug Info for Microform */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs">
          <div className="text-yellow-800 font-medium mb-1">🔧 Debug Info:</div>
          <div className="text-yellow-700">
            • Microform Ready: {microformReady ? '✅ Yes' : '❌ No'}<br/>
            • Processing Payment: {processingPayment ? '✅ Yes' : '❌ No'}<br/>
            • Show Create Button: {showCreateTokenButton ? '✅ Yes' : '❌ No'}<br/>
            • Current Step: {currentStep}
          </div>
        </div>

        {/* Step 1: Create Transient Token */}
        {showCreateTokenButton && (
          <button
            type="button"
            onClick={createTransientToken}
            disabled={processingPayment}
            className="w-full py-3 px-4 font-medium rounded-lg transition-all text-sm flex items-center justify-center border-2 bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700 shadow-md hover:shadow-lg disabled:bg-gray-500 disabled:border-gray-500 disabled:cursor-not-allowed"
          >
            {currentStep === 'token-creation' ? (
              <>
                <LoadingSpinner />
                Creating Transient Token...
              </>
            ) : (
              <>
                <svg className="mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
                </svg>
                1. Create Transient Token
              </>
            )}
          </button>
        )}

        {/* Step 2: Verify Transient Token */}
        {showVerifyTokenButton && (
          <div className="space-y-2">
            {/* Show the token */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <span className="text-xs font-medium text-yellow-800 block mb-1">
                    🎫 Transient Token Created
                  </span>
                  <div className="text-xs text-yellow-700 font-mono break-all bg-yellow-100 p-2 rounded">
                    {transientToken}
                  </div>
                </div>
              </div>
            </div>
            
            <button
              type="button"
              onClick={verifyTransientTokenManually}
              disabled={processingPayment}
              className="w-full py-3 px-4 font-medium rounded-lg transition-all text-sm flex items-center justify-center border-2 bg-orange-600 text-white border-orange-600 hover:bg-orange-700 hover:border-orange-700 shadow-md hover:shadow-lg disabled:bg-gray-500 disabled:border-gray-500 disabled:cursor-not-allowed"
              style={{
                backgroundColor: processingPayment ? '#6b7280' : '#ea580c',
                color: '#ffffff',
                borderColor: processingPayment ? '#6b7280' : '#ea580c'
              }}
            >
              {currentStep === 'token-validation' ? (
                <>
                  <LoadingSpinner />
                  Verifying Transient Token...
                </>
              ) : (
                <>
                  <svg className="mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  2. Verify Transient Token
                </>
              )}
            </button>
          </div>
        )}

        {/* Step 3: Setup Authentication */}
        {showSetupAuthButton && (
          <div className="space-y-2">
            {/* Show the JTI */}
            {safeGetJTI && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <span className="text-xs font-medium text-green-800 block mb-1">
                      ✅ Token Verified - JTI Ready
                    </span>
                    <div className="text-xs text-green-700 font-mono break-all bg-green-100 p-2 rounded">
                      JTI: {safeGetJTI}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <button
              type="button"
              onClick={setupAuthenticationManually}
              disabled={processingPayment}
              className={`w-full py-3 px-4 text-white font-medium rounded-lg transition-all text-sm flex items-center justify-center ${
                processingPayment
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg active:scale-[0.98]'
              }`}
            >
              {currentStep === 'auth-setup' ? (
                <>
                  <LoadingSpinner />
                  Setting up Authentication...
                </>
              ) : (
                <>
                  <svg className="mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  3. Setup Authentication
                </>
              )}
            </button>
          </div>
        )}

        {/* Step 4: Enrollment Check Button */}
        {deviceCollectionComplete && !enrollmentCheckComplete && (
          <div className="space-y-2">
            {/* Show device collection complete + reference ID */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <span className="text-xs font-medium text-indigo-800 block mb-1">
                    ✅ Device Collection Complete - Ready for Enrollment Check
                  </span>
                  {safeGetReferenceId && (
                    <div className="text-xs text-indigo-700 font-mono break-all bg-indigo-100 p-2 rounded mt-2">
                      Reference ID: {safeGetReferenceId}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <button
              type="button"
              onClick={startEnrollmentCheck}
              disabled={isCheckingEnrollment}
              className="w-full py-3 px-4 font-medium rounded-lg transition-all text-sm flex items-center justify-center border-2 bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700 shadow-md hover:shadow-lg disabled:bg-gray-500 disabled:border-gray-500 disabled:cursor-not-allowed"
            >
              {isCheckingEnrollment ? (
                <>
                  <LoadingSpinner />
                  Checking Enrollment...
                </>
              ) : (
                <>
                  <svg className="mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  4. Check Payer Authentication Enrollment
                </>
              )}
            </button>
          </div>
        )}

        {/* Help Text */}
        {!enrollmentCheckComplete && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
            <div className="text-xs text-blue-700">
              <span className="font-medium">💡 Manual Flow:</span>
              <ul className="mt-1 space-y-1 ml-4">
                <li className={`${(transientTokenCreated || transientToken) ? 'line-through text-blue-500' : ''}`}>
                  • Create transient token from card data
                </li>
                <li className={`${tokenValidated ? 'line-through text-blue-500' : !(transientTokenCreated || transientToken) ? 'text-gray-400' : ''}`}>
                  • Verify token and extract JTI
                </li>
                <li className={`${authenticationSetupComplete ? 'line-through text-blue-500' : !tokenValidated ? 'text-gray-400' : ''}`}>
                  • Setup authentication with JTI
                </li>
                <li className={`${deviceCollectionComplete ? 'line-through text-blue-500' : !authenticationSetupComplete ? 'text-gray-400' : ''}`}>
                  • Device data collection (Cardinal Commerce)
                </li>
                <li className={`${enrollmentCheckComplete ? 'line-through text-blue-500' : !deviceCollectionComplete ? 'text-gray-400' : ''}`}>
                  • Check payer authentication enrollment
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Device Collection Complete Status */}
        {currentStep === 'device-complete' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
            <div className="flex items-center">
              <svg className="h-4 w-4 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-medium text-green-800">Device collection completed successfully!</span>
            </div>
            <div className="text-xs text-green-600 mt-1">
              Device fingerprint data submitted to Cardinal Commerce. Ready for enrollment check.
            </div>
          </div>
        )}

        {/* Device Collection Status */}
        {currentStep === 'device-collection' && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mt-4">
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm font-medium text-purple-800">Submitting device data...</span>
            </div>
            <div className="text-xs text-purple-600 mt-1">
              Sending device fingerprint data to Cardinal Commerce and proceeding immediately.
            </div>
          </div>
        )}

        {/* Enrollment Check Status */}
        {currentStep === 'enrollment-check' && (
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 mt-4">
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm font-medium text-teal-800">Checking payer authentication enrollment...</span>
            </div>
            <div className="text-xs text-teal-600 mt-1">
              Verifying card enrollment status for 3D Secure authentication.
            </div>
          </div>
        )}

        {/* Complete Status */}
        {currentStep === 'complete' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
            <div className="flex items-center">
              <svg className="h-4 w-4 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-medium text-green-800">Payment flow completed successfully!</span>
            </div>
            <div className="text-xs text-green-600 mt-1">
              All steps completed: Token creation → Verification → Authentication → Device collection → Enrollment check
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error in PaymentButton component:', error);
    return null;
  }
};

export default PaymentButton; 