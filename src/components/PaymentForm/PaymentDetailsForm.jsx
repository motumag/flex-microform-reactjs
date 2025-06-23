import React from 'react';
import { usePaymentForm } from '../../hooks/usePaymentForm';

const PaymentDetailsForm = () => {
  const {
    amount,
    currency,
    billingInfo,
    updateAmount,
    updateCurrency,
    updateBillingInfo,
  } = usePaymentForm();

  const handleBillingChange = (field, value) => {
    updateBillingInfo({ [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Payment Amount Section */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Payment Amount</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="amount" className="block text-xs font-medium text-gray-600 mb-1">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => updateAmount(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="30.00"
            />
          </div>
          <div>
            <label htmlFor="currency" className="block text-xs font-medium text-gray-600 mb-1">
              Currency
            </label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => updateCurrency(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="CAD">CAD</option>
              <option value="AUD">AUD</option>
            </select>
          </div>
        </div>
      </div>

      {/* Billing Information Section */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Billing Information</h3>
        <div className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-xs font-medium text-gray-600 mb-1">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={billingInfo.firstName}
                onChange={(e) => handleBillingChange('firstName', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-xs font-medium text-gray-600 mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={billingInfo.lastName}
                onChange={(e) => handleBillingChange('lastName', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Doe"
              />
            </div>
          </div>

          {/* Address Fields */}
          <div>
            <label htmlFor="address1" className="block text-xs font-medium text-gray-600 mb-1">
              Address Line 1
            </label>
            <input
              type="text"
              id="address1"
              value={billingInfo.address1}
              onChange={(e) => handleBillingChange('address1', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="123 Main Street"
            />
          </div>

          <div>
            <label htmlFor="address2" className="block text-xs font-medium text-gray-600 mb-1">
              Address Line 2 (Optional)
            </label>
            <input
              type="text"
              id="address2"
              value={billingInfo.address2}
              onChange={(e) => handleBillingChange('address2', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Apt 4B"
            />
          </div>

          {/* City, State, Postal Code */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="locality" className="block text-xs font-medium text-gray-600 mb-1">
                City
              </label>
              <input
                type="text"
                id="locality"
                value={billingInfo.locality}
                onChange={(e) => handleBillingChange('locality', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="New York"
              />
            </div>
            <div>
              <label htmlFor="administrativeArea" className="block text-xs font-medium text-gray-600 mb-1">
                State/Province
              </label>
              <input
                type="text"
                id="administrativeArea"
                value={billingInfo.administrativeArea}
                onChange={(e) => handleBillingChange('administrativeArea', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="NY"
              />
            </div>
            <div>
              <label htmlFor="postalCode" className="block text-xs font-medium text-gray-600 mb-1">
                Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                value={billingInfo.postalCode}
                onChange={(e) => handleBillingChange('postalCode', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="10001"
              />
            </div>
          </div>

          {/* Country and Building Number */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="country" className="block text-xs font-medium text-gray-600 mb-1">
                Country
              </label>
              <select
                id="country"
                value={billingInfo.country}
                onChange={(e) => handleBillingChange('country', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
                <option value="AU">Australia</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="IT">Italy</option>
                <option value="ES">Spain</option>
                <option value="JP">Japan</option>
                <option value="CN">China</option>
              </select>
            </div>
            <div>
              <label htmlFor="buildingNumber" className="block text-xs font-medium text-gray-600 mb-1">
                Building Number (Optional)
              </label>
              <input
                type="text"
                id="buildingNumber"
                value={billingInfo.buildingNumber}
                onChange={(e) => handleBillingChange('buildingNumber', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="123"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={billingInfo.email}
                onChange={(e) => handleBillingChange('email', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="customer@example.com"
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-xs font-medium text-gray-600 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={billingInfo.phoneNumber}
                onChange={(e) => handleBillingChange('phoneNumber', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1234567890"
              />
            </div>
          </div>

          {/* District (Optional) */}
          <div>
            <label htmlFor="district" className="block text-xs font-medium text-gray-600 mb-1">
              District (Optional)
            </label>
            <input
              type="text"
              id="district"
              value={billingInfo.district}
              onChange={(e) => handleBillingChange('district', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="District"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsForm; 