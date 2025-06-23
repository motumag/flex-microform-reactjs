import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Form data
  cardholderName: "",
  expirationMonth: "01",
  expirationYear: "25",

  // Payment amount information
  amount: "30.00",
  currency: "USD",

  // Billing information
  billingInfo: {
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    locality: "",
    administrativeArea: "",
    postalCode: "",
    country: "",
    district: "",
    buildingNumber: "",
    email: "",
    phoneNumber: "",
  },

  // Flex configuration
  flexConfig: {
    captureContext: null,
    clientLibrary: null,
    clientLibraryIntegrity: null,
  },

  // Microform instance and status
  microformInstance: null,
  microformReady: false,

  // Token information
  transientToken: null,
  tokenValidationResponse: null,
  authenticationSetupResponse: null,
  enrollmentCheckResponse: null,
  threeDSCompletionData: null,

  // Processing flow states
  captureContextLoaded: false,
  transientTokenCreated: false,
  tokenValidated: false,
  authenticationSetupComplete: false,
  deviceCollectionComplete: false,
  enrollmentCheckComplete: false,

  // UI state
  loading: false,
  error: null,
  copiedField: null,

  // Payment processing state
  processingPayment: false,
  paymentSuccess: false,
  currentStep: "idle", // 'idle', 'capture-context', 'token-creation', 'token-created', 'token-validation', 'token-verified', 'auth-setup', 'device-collection', 'enrollment-check', 'complete'
};

const paymentFormSlice = createSlice({
  name: "paymentForm",
  initialState,
  reducers: {
    // Form field updates
    setCardholderName: (state, action) => {
      state.cardholderName = action.payload;
    },
    setExpirationMonth: (state, action) => {
      state.expirationMonth = action.payload;
    },
    setExpirationYear: (state, action) => {
      state.expirationYear = action.payload;
    },

    // Payment amount
    setAmount: (state, action) => {
      state.amount = action.payload;
    },
    setCurrency: (state, action) => {
      state.currency = action.payload;
    },

    // Billing information
    setBillingInfo: (state, action) => {
      state.billingInfo = { ...state.billingInfo, ...action.payload };
    },
    updateBillingField: (state, action) => {
      const { field, value } = action.payload;
      state.billingInfo[field] = value;
    },

    // Flex configuration
    setFlexConfig: (state, action) => {
      state.flexConfig = action.payload;
      state.captureContextLoaded = true;
      state.currentStep = "capture-context";
    },
    updateFlexConfig: (state, action) => {
      state.flexConfig = { ...state.flexConfig, ...action.payload };
    },

    // Microform management
    setMicroformInstance: (state, action) => {
      state.microformInstance = action.payload;
      state.microformReady = !!action.payload;
    },
    setMicroformReady: (state, action) => {
      state.microformReady = action.payload;
    },

    // Token management
    setTransientToken: (state, action) => {
      console.log("🔴 Redux setTransientToken called with:", action.payload);
      state.transientToken = action.payload;
      state.transientTokenCreated = true;
      state.currentStep = "token-created";
      console.log("🔴 Redux state updated - transientToken:", state.transientToken, "transientTokenCreated:", state.transientTokenCreated);
    },
    setTokenValidationResponse: (state, action) => {
      state.tokenValidationResponse = action.payload;
      state.tokenValidated = true;
      state.currentStep = "token-verified";
    },
    setAuthenticationSetupResponse: (state, action) => {
      state.authenticationSetupResponse = action.payload;
      state.authenticationSetupComplete = true;
      state.currentStep = "device-collection";
    },
    setDeviceCollectionComplete: (state, action) => {
      state.deviceCollectionComplete = true;
      // Update step to show device collection is complete
      state.currentStep = "device-complete";
    },
    setEnrollmentCheckResponse: (state, action) => {
      state.enrollmentCheckResponse = action.payload;
      state.enrollmentCheckComplete = true;
      state.paymentSuccess = true;
      state.currentStep = "complete";
    },
    setThreeDSCompletionData: (state, action) => {
      state.threeDSCompletionData = action.payload;
      state.currentStep = "3ds-complete";
    },

    // Clear token data
    clearTokenData: (state) => {
      state.transientToken = null;
      state.tokenValidationResponse = null;
      state.authenticationSetupResponse = null;
      state.enrollmentCheckResponse = null;
      state.transientTokenCreated = false;
      state.tokenValidated = false;
      state.authenticationSetupComplete = false;
      state.deviceCollectionComplete = false;
      state.enrollmentCheckComplete = false;
      state.paymentSuccess = false;
    },

    // UI state management
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCopiedField: (state, action) => {
      state.copiedField = action.payload;
    },
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },

    // Payment processing
    setProcessingPayment: (state, action) => {
      state.processingPayment = action.payload;
    },

    // Reset form
    resetForm: (state) => {
      state.cardholderName = "";
      state.amount = "30.00";
      state.currency = "USD";
      state.billingInfo = {
        firstName: "",
        lastName: "",
        address1: "",
        address2: "",
        locality: "",
        administrativeArea: "",
        postalCode: "",
        country: "",
        district: "",
        buildingNumber: "",
        email: "",
        phoneNumber: "",
      };
      state.transientToken = null;
      state.tokenValidationResponse = null;
      state.authenticationSetupResponse = null;
      state.enrollmentCheckResponse = null;
      state.error = null;
      state.paymentSuccess = false;
      state.processingPayment = false;
      state.transientTokenCreated = false;
      state.tokenValidated = false;
      state.authenticationSetupComplete = false;
      state.deviceCollectionComplete = false;
      state.enrollmentCheckComplete = false;
      state.currentStep = "idle";
    },

    // Reset all state
    resetAll: () => initialState,
  },
});

export const {
  setCardholderName,
  setExpirationMonth,
  setExpirationYear,
  setAmount,
  setCurrency,
  setBillingInfo,
  updateBillingField,
  setFlexConfig,
  updateFlexConfig,
  setMicroformInstance,
  setMicroformReady,
  setTransientToken,
  setTokenValidationResponse,
  setAuthenticationSetupResponse,
  setDeviceCollectionComplete,
  setEnrollmentCheckResponse,
  setThreeDSCompletionData,
  clearTokenData,
  setLoading,
  setError,
  clearError,
  setCopiedField,
  setCurrentStep,
  setProcessingPayment,
  resetForm,
  resetAll,
} = paymentFormSlice.actions;

export default paymentFormSlice.reducer;

// Selectors
export const selectCardholderName = (state) => state.paymentForm.cardholderName;
export const selectExpirationMonth = (state) => state.paymentForm.expirationMonth;
export const selectExpirationYear = (state) => state.paymentForm.expirationYear;
export const selectAmount = (state) => state.paymentForm.amount;
export const selectCurrency = (state) => state.paymentForm.currency;
export const selectBillingInfo = (state) => state.paymentForm.billingInfo;
export const selectFlexConfig = (state) => state.paymentForm.flexConfig;
export const selectMicroformInstance = (state) => state.paymentForm.microformInstance;
export const selectMicroformReady = (state) => state.paymentForm.microformReady;
export const selectTransientToken = (state) => state.paymentForm.transientToken;
export const selectTokenValidationResponse = (state) => state.paymentForm.tokenValidationResponse;
export const selectAuthenticationSetupResponse = (state) => state.paymentForm.authenticationSetupResponse;
export const selectEnrollmentCheckResponse = (state) => state.paymentForm.enrollmentCheckResponse;
export const selectLoading = (state) => state.paymentForm.loading;
export const selectError = (state) => state.paymentForm.error;
export const selectCopiedField = (state) => state.paymentForm.copiedField;
export const selectProcessingPayment = (state) => state.paymentForm.processingPayment;
export const selectPaymentSuccess = (state) => state.paymentForm.paymentSuccess;
export const selectCurrentStep = (state) => state.paymentForm.currentStep;
export const selectCaptureContextLoaded = (state) => state.paymentForm.captureContextLoaded;
export const selectTransientTokenCreated = (state) => state.paymentForm.transientTokenCreated;
export const selectTokenValidated = (state) => state.paymentForm.tokenValidated;
export const selectAuthenticationSetupComplete = (state) => state.paymentForm.authenticationSetupComplete;
export const selectDeviceCollectionComplete = (state) => state.paymentForm.deviceCollectionComplete;
export const selectEnrollmentCheckComplete = (state) => state.paymentForm.enrollmentCheckComplete;
export const selectThreeDSCompletionData = (state) => state.paymentForm.threeDSCompletionData;
