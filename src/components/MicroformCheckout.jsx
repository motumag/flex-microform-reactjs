import React from 'react';
import PaymentForm from './PaymentForm/PaymentForm';
import DebugPanel from './DebugPanel/DebugPanel';
import TransientTokenPanel from './DebugPanel/TransientTokenPanel';
import AuthenticationSetupPanel from './DebugPanel/AuthenticationSetupPanel';
import ErrorDetailsPanel from './DebugPanel/ErrorDetailsPanel';

const MicroformCheckout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            CyberSource Microform Payment Integration
          </h1>
          <p className="text-gray-600">
            Complete payment flow with token validation and authentication setup
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Payment Form */}
          <div className="space-y-6">
            <PaymentForm />
          </div>
          
          {/* Right Column - Debug Information */}
          <div className="space-y-6">
            <DebugPanel />
            <ErrorDetailsPanel />
            <TransientTokenPanel />
            <AuthenticationSetupPanel />
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            🔒 This is a development environment for testing CyberSource Microform integration
          </p>
          <p className="mt-1">
            Powered by Redux Toolkit + RTK Query
          </p>
        </div>
      </div>
    </div>
  );
};

export default MicroformCheckout; 