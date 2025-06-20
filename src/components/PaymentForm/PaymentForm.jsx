import React from 'react';
import { usePaymentForm } from '../../hooks/usePaymentForm';
import { useMicroform } from '../../hooks/useMicroform';
import CardPreview from './CardPreview';
import PaymentFormFields from './PaymentFormFields';
import PaymentButton from './PaymentButton';
import StatusMessages from './StatusMessages';

const PaymentForm = () => {
  const {
    cardholderName,
    updateCardholderName,
    error,
    loading,
    microformReady,
    processingPayment,
    currentStep,
    authenticationSetupComplete,
    transientToken,
  } = usePaymentForm();
  
  const { isGettingContext, isValidatingToken, isSettingUpAuth } = useMicroform();

  const isProcessing = processingPayment || isGettingContext || isValidatingToken || isSettingUpAuth;
  const isFormDisabled = !microformReady || loading || isProcessing;

  // Debug logging to see what transientToken we're getting
  React.useEffect(() => {
    console.log("🔍 PaymentForm - transientToken changed:", {
      value: transientToken,
      type: typeof transientToken,
      length: transientToken?.length,
      exists: !!transientToken
    });
  }, [transientToken]);

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <span className="mr-2">💳</span>
            Secure Payment
          </h2>
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <div className="flex items-center">
            <svg className="h-3.5 w-3.5 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Secure</span>
          </div>
          {currentStep !== 'idle' && (
            <div className="flex items-center">
              <div className="h-2 w-2 bg-blue-500 rounded-full mr-1 animate-pulse"></div>
              <span className="capitalize">{currentStep.replace('-', ' ')}</span>
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="p-5 text-center">
          <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin"></div>
          <p className="mt-2 text-sm text-gray-600">Loading payment form...</p>
        </div>
      )}

      <StatusMessages error={error} />

      <form id="my-sample-form" className="p-5 space-y-4">
        <CardPreview cardholderName={cardholderName} />
        
        <div>
          <label htmlFor="cardholderName" className="block text-xs font-medium text-gray-700 mb-1">
            Cardholder Name
          </label>
          <input 
            id="cardholderName" 
            name="cardholderName" 
            placeholder="Name on card" 
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-input text-sm" 
            value={cardholderName}
            onChange={(e) => updateCardholderName(e.target.value)}
            disabled={isFormDisabled}
          />
        </div>

        <PaymentFormFields disabled={isFormDisabled} />

        {/* Token Display Section - shows when token is created */}
        {transientToken && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm font-medium text-blue-800 mb-2 flex items-center">
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              JWT Transient Token Created
            </div>
            <div className="bg-white p-3 rounded border text-xs font-mono break-all">
              {transientToken}
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-blue-600">Token Length: {transientToken.length} characters</span>
              <button
                onClick={() => navigator.clipboard.writeText(transientToken)}
                className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
              >
                Copy Token
              </button>
            </div>
          </div>
        )}

        <PaymentButton />

        <input type="hidden" id="flexresponse" name="flexresponse" />
      </form>
    </div>
  );
};

export default PaymentForm; 