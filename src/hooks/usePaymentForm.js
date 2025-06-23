import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
  setCardholderName,
  setExpirationMonth,
  setExpirationYear,
  setAmount,
  setCurrency,
  setBillingInfo,
  updateBillingField,
  setFlexConfig,
  setMicroformInstance,
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
  selectCardholderName,
  selectExpirationMonth,
  selectExpirationYear,
  selectAmount,
  selectCurrency,
  selectBillingInfo,
  selectFlexConfig,
  selectMicroformInstance,
  selectMicroformReady,
  selectTransientToken,
  selectTokenValidationResponse,
  selectAuthenticationSetupResponse,
  selectEnrollmentCheckResponse,
  selectThreeDSCompletionData,
  selectLoading,
  selectError,
  selectCopiedField,
  selectProcessingPayment,
  selectPaymentSuccess,
  selectCurrentStep,
  selectCaptureContextLoaded,
  selectTransientTokenCreated,
  selectTokenValidated,
  selectAuthenticationSetupComplete,
  selectDeviceCollectionComplete,
  selectEnrollmentCheckComplete,
} from "../store/slices/paymentFormSlice";

export const usePaymentForm = () => {
  const dispatch = useDispatch();

  // Selectors
  const cardholderName = useSelector(selectCardholderName);
  const expirationMonth = useSelector(selectExpirationMonth);
  const expirationYear = useSelector(selectExpirationYear);
  const amount = useSelector(selectAmount);
  const currency = useSelector(selectCurrency);
  const billingInfo = useSelector(selectBillingInfo);
  const flexConfig = useSelector(selectFlexConfig);
  const microformInstance = useSelector(selectMicroformInstance);
  const microformReady = useSelector(selectMicroformReady);
  const transientToken = useSelector(selectTransientToken);
  const tokenValidationResponse = useSelector(selectTokenValidationResponse);
  const authenticationSetupResponse = useSelector(selectAuthenticationSetupResponse);
  const enrollmentCheckResponse = useSelector(selectEnrollmentCheckResponse);
  const threeDSCompletionData = useSelector(selectThreeDSCompletionData);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const copiedField = useSelector(selectCopiedField);
  const processingPayment = useSelector(selectProcessingPayment);
  const paymentSuccess = useSelector(selectPaymentSuccess);
  const currentStep = useSelector(selectCurrentStep);
  const captureContextLoaded = useSelector(selectCaptureContextLoaded);
  const transientTokenCreated = useSelector(selectTransientTokenCreated);
  const tokenValidated = useSelector(selectTokenValidated);
  const authenticationSetupComplete = useSelector(selectAuthenticationSetupComplete);
  const deviceCollectionComplete = useSelector(selectDeviceCollectionComplete);
  const enrollmentCheckComplete = useSelector(selectEnrollmentCheckComplete);

  // Actions
  const updateCardholderName = useCallback(
    (name) => {
      dispatch(setCardholderName(name));
    },
    [dispatch]
  );

  const updateExpirationMonth = useCallback(
    (month) => {
      dispatch(setExpirationMonth(month));
    },
    [dispatch]
  );

  const updateExpirationYear = useCallback(
    (year) => {
      dispatch(setExpirationYear(year));
    },
    [dispatch]
  );

  const updateAmount = useCallback(
    (amount) => {
      dispatch(setAmount(amount));
    },
    [dispatch]
  );

  const updateCurrency = useCallback(
    (currency) => {
      dispatch(setCurrency(currency));
    },
    [dispatch]
  );

  const updateBillingInfo = useCallback(
    (info) => {
      dispatch(setBillingInfo(info));
    },
    [dispatch]
  );

  const updateFlexConfig = useCallback(
    (config) => {
      dispatch(setFlexConfig(config));
    },
    [dispatch]
  );

  const updateMicroformInstance = useCallback(
    (instance) => {
      dispatch(setMicroformInstance(instance));
    },
    [dispatch]
  );

  const updateTransientToken = useCallback(
    (token) => {
      console.log("🔄 updateTransientToken called with:", token);
      dispatch(setTransientToken(token));
      console.log("🔄 setTransientToken dispatched");
    },
    [dispatch]
  );

  const updateTokenValidationResponse = useCallback(
    (response) => {
      dispatch(setTokenValidationResponse(response));
    },
    [dispatch]
  );

  const updateAuthenticationSetupResponse = useCallback(
    (response) => {
      dispatch(setAuthenticationSetupResponse(response));
    },
    [dispatch]
  );

  const updateDeviceCollectionComplete = useCallback(
    (complete) => {
      dispatch(setDeviceCollectionComplete(complete));
    },
    [dispatch]
  );

  const updateEnrollmentCheckResponse = useCallback(
    (response) => {
      dispatch(setEnrollmentCheckResponse(response));
    },
    [dispatch]
  );

  const updateThreeDSCompletionData = useCallback(
    (data) => {
      dispatch(setThreeDSCompletionData(data));
    },
    [dispatch]
  );

  const clearAllTokenData = useCallback(() => {
    dispatch(clearTokenData());
  }, [dispatch]);

  const setFormLoading = useCallback(
    (isLoading) => {
      dispatch(setLoading(isLoading));
    },
    [dispatch]
  );

  const setFormError = useCallback(
    (errorMessage) => {
      dispatch(setError(errorMessage));
    },
    [dispatch]
  );

  const clearFormError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const setFieldCopied = useCallback(
    (field) => {
      dispatch(setCopiedField(field));
      // Auto-clear after 2 seconds
      setTimeout(() => {
        dispatch(setCopiedField(null));
      }, 2000);
    },
    [dispatch]
  );

  const updateCurrentStep = useCallback(
    (step) => {
      dispatch(setCurrentStep(step));
    },
    [dispatch]
  );

  const setPaymentProcessing = useCallback(
    (isProcessing) => {
      dispatch(setProcessingPayment(isProcessing));
    },
    [dispatch]
  );

  const resetPaymentForm = useCallback(() => {
    dispatch(resetForm());
  }, [dispatch]);

  // Utility functions
  const copyToClipboard = useCallback(
    async (text, fieldName) => {
      if (!text) return false;

      try {
        await navigator.clipboard.writeText(text);
        setFieldCopied(fieldName);
        return true;
      } catch (err) {
        console.error("Failed to copy text: ", err);
        return false;
      }
    },
    [setFieldCopied]
  );

  const getDisplayToken = useCallback(() => {
    if (!transientToken || typeof transientToken !== "string") {
      return "N/A";
    }
    try {
      return transientToken.substring(0, 15) + "...";
    } catch (e) {
      return "N/A";
    }
  }, [transientToken]);

  const getJtiFromValidationResponse = useCallback(() => {
    if (!tokenValidationResponse || !tokenValidationResponse.data) {
      return null;
    }
    return tokenValidationResponse.data.jti || null;
  }, [tokenValidationResponse]);

  const getExpMonth = useCallback(() => {
    try {
      const el = document.getElementById("expMonth");
      return el && el.value ? el.value : expirationMonth;
    } catch (e) {
      return expirationMonth;
    }
  }, [expirationMonth]);

  const getExpYear = useCallback(() => {
    try {
      const el = document.getElementById("expYear");
      if (!el || !el.value) return expirationYear;
      return typeof el.value === "string" ? el.value.substring(2, 4) : expirationYear;
    } catch (e) {
      return expirationYear;
    }
  }, [expirationYear]);

  const getStepStatus = useCallback(
    (step) => {
      switch (step) {
        case "capture-context":
          return captureContextLoaded ? "completed" : "pending";
        case "token-creation":
          return transientTokenCreated ? "completed" : "pending";
        case "token-validation":
          return tokenValidated ? "completed" : "pending";
        case "auth-setup":
          return authenticationSetupComplete ? "completed" : "pending";
        default:
          return "pending";
      }
    },
    [captureContextLoaded, transientTokenCreated, tokenValidated, authenticationSetupComplete]
  );

  return {
    // State
    cardholderName,
    expirationMonth,
    expirationYear,
    amount,
    currency,
    billingInfo,
    flexConfig,
    microformInstance,
    microformReady,
    transientToken,
    tokenValidationResponse,
    authenticationSetupResponse,
    enrollmentCheckResponse,
    threeDSCompletionData,
    loading,
    error,
    copiedField,
    processingPayment,
    paymentSuccess,
    currentStep,
    captureContextLoaded,
    transientTokenCreated,
    tokenValidated,
    authenticationSetupComplete,
    deviceCollectionComplete,
    enrollmentCheckComplete,

    // Actions
    updateCardholderName,
    updateExpirationMonth,
    updateExpirationYear,
    updateAmount,
    updateCurrency,
    updateBillingInfo,
    updateFlexConfig,
    updateMicroformInstance,
    updateTransientToken,
    updateTokenValidationResponse,
    updateAuthenticationSetupResponse,
    updateDeviceCollectionComplete,
    updateEnrollmentCheckResponse,
    updateThreeDSCompletionData,
    clearAllTokenData,
    setFormLoading,
    setFormError,
    clearFormError,
    setFieldCopied,
    updateCurrentStep,
    setPaymentProcessing,
    resetPaymentForm,

    // Utilities
    copyToClipboard,
    getDisplayToken,
    getJtiFromValidationResponse,
    getExpMonth,
    getExpYear,
    getStepStatus,
  };
};
