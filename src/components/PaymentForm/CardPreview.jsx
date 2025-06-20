import React from 'react';
import { usePaymentForm } from '../../hooks/usePaymentForm';

const CardPreview = ({ cardholderName }) => {
  const { getExpMonth, getExpYear } = usePaymentForm();

  return (
    <div className="mb-5 relative">
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-4 shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:rotate-1 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 800 800">
            <defs>
              <pattern id="a" patternUnits="userSpaceOnUse" width="25" height="25" patternTransform="scale(2) rotate(0)">
                <rect x="0" y="0" width="100%" height="100%" fill="none" />
                <path d="M25 0H0v25" fill="none" stroke="#FFF" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="800" height="800" fill="url(#a)" />
          </svg>
        </div>

        <div className="flex justify-between relative z-10">
          <div className="text-white opacity-80">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex space-x-1">
            <div className="w-5 h-5 rounded-full bg-yellow-400 opacity-90"></div>
            <div className="w-5 h-5 rounded-full bg-red-500 opacity-80 -ml-3"></div>
          </div>
        </div>
        <div className="mt-4 text-white tracking-wider text-base opacity-90">
          •••• •••• •••• ••••
        </div>
        <div className="mt-4 flex justify-between">
          <div className="text-white opacity-90">
            <div className="text-xs">Card Holder</div>
            <div className="font-medium tracking-wide overflow-ellipsis overflow-hidden whitespace-nowrap max-w-[120px] capitalize text-sm">
              {cardholderName || 'YOUR NAME'}
            </div>
          </div>
          <div className="text-white opacity-90">
            <div className="text-xs">Expires</div>
            <div className="font-medium tracking-wide text-sm">
              {getExpMonth()}/{getExpYear()}
            </div>
          </div>
        </div>
        
        {/* Shine effect */}
        <div className="absolute -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-10 animate-shine"></div>
      </div>
    </div>
  );
};

export default CardPreview; 