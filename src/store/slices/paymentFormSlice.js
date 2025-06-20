import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Form data
  cardholderName: "",
  expirationMonth: "01",
  expirationYear: "25",

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

  // Processing flow states
  captureContextLoaded: false,
  transientTokenCreated: false,
  tokenValidated: false,
  authenticationSetupComplete: false,

  // UI state
  loading: false,
  error: null,
  copiedField: null,

  // Payment processing state
  processingPayment: false,
  paymentSuccess: false,
  currentStep: "idle", // 'idle', 'capture-context', 'token-creation', 'token-created', 'token-validation', 'token-verified', 'auth-setup', 'complete'
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
      state.paymentSuccess = true;
      state.currentStep = "complete";
    },

    // Clear token data
    clearTokenData: (state) => {
      state.transientToken = null;
      state.tokenValidationResponse = null;
      state.authenticationSetupResponse = null;
      state.transientTokenCreated = false;
      state.tokenValidated = false;
      state.authenticationSetupComplete = false;
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
      state.transientToken = null;
      state.tokenValidationResponse = null;
      state.authenticationSetupResponse = null;
      state.error = null;
      state.paymentSuccess = false;
      state.processingPayment = false;
      state.transientTokenCreated = false;
      state.tokenValidated = false;
      state.authenticationSetupComplete = false;
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
  setFlexConfig,
  updateFlexConfig,
  setMicroformInstance,
  setMicroformReady,
  setTransientToken,
  setTokenValidationResponse,
  setAuthenticationSetupResponse,
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
export const selectFlexConfig = (state) => state.paymentForm.flexConfig;
export const selectMicroformInstance = (state) => state.paymentForm.microformInstance;
export const selectMicroformReady = (state) => state.paymentForm.microformReady;
export const selectTransientToken = (state) => state.paymentForm.transientToken;
export const selectTokenValidationResponse = (state) => state.paymentForm.tokenValidationResponse;
export const selectAuthenticationSetupResponse = (state) => state.paymentForm.authenticationSetupResponse;
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
