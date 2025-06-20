import React from 'react';

const PaymentFormFields = ({ disabled = false }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Card Information
        </label>
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-7 relative group">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div 
              id="number-container" 
              className={`w-full pl-9 pr-10 py-3 rounded-l-lg border border-gray-300 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-all bg-white flex items-center relative shadow-input h-11 text-sm ${disabled ? 'opacity-50' : ''}`}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="flex space-x-1">
                <img src="https://cdn.visa.com/v2/assets/images/logos/visa/blue/logo.png" alt="Visa" className="h-3.5 opacity-60" />
              </div>
            </div>
          </div>
          
          <div className="col-span-2 relative group">
            <div 
              id="securityCode-container" 
              className={`w-full px-3 py-3 border-y border-r rounded-none border-gray-300 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-all bg-white relative shadow-input h-11 text-sm ${disabled ? 'opacity-50' : ''}`}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 116 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="absolute -bottom-5 w-full text-center">
              <span className="text-xs text-gray-500">CVC</span>
            </div>
          </div>
          
          <div className="col-span-3 relative group">
            <div className="absolute inset-0 flex">
              <select 
                id="expMonth" 
                disabled={disabled}
                className={`w-1/2 px-2 py-3 border-y border-gray-300 rounded-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all appearance-none bg-white shadow-input h-11 text-center text-sm ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {[...Array(12)].map((_, i) => {
                  const val = (i + 1).toString().padStart(2, '0');
                  return <option key={val} value={val}>{val}</option>;
                })}
              </select>
              <span className="flex items-center text-gray-400 px-1">/</span>
              <select 
                id="expYear" 
                disabled={disabled}
                className={`w-1/2 px-2 py-3 border-y border-r border-gray-300 rounded-r-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all appearance-none bg-white shadow-input h-11 text-center text-sm ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {[2025, 2026, 2027, 2028, 2029, 2030].map(year => (
                  <option key={year} value={year}>{year.toString().substring(2)}</option>
                ))}
              </select>
            </div>
            <div className="absolute -bottom-5 w-full text-center">
              <span className="text-xs text-gray-500">MM / YY</span>
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-6 text-xs text-gray-500">
          <div className="flex items-center">
            <svg className="h-3 w-3 mr-1 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Your card details are secure and encrypted</span>
          </div>
          <div className="flex items-center space-x-2">
            <img src="https://cdn.visa.com/v2/assets/images/logos/visa/blue/logo.png" alt="Visa" className="h-3.5" />
            <img src="https://www.mastercard.us/content/dam/mccom/global/logos/logo-mastercard-mobile.svg" alt="Mastercard" className="h-3.5" />
          </div>
        </div>
        
        {/* Test Card Information */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-xs font-medium text-blue-800 mb-2">🧪 Test Card Numbers:</div>
          <div className="text-xs text-blue-700 space-y-1">
            <div><strong>Visa:</strong> 4000000000000002 | <strong>CVV:</strong> 123</div>
            <div><strong>Mastercard:</strong> 5555555555554444 | <strong>CVV:</strong> 999</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFormFields; 