import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetCaptureContextMutation, useValidateTokenMutation, useSetupAuthenticationMutation } from "../store/api/paymentApi";
import { usePaymentForm } from "./usePaymentForm";
import { useDebug } from "./useDebug";
import { setScriptLoaded, setMicroformInitialized, setFieldsLoaded, setApiConnected, setLastApiCall, addError, addLog } from "../store/slices/debugSlice";
import { selectTransientToken } from "../store/slices/paymentFormSlice";

export const useMicroform = () => {
  const dispatch = useDispatch();
  const {
    flexConfig,
    updateFlexConfig,
    updateMicroformInstance,
    setFormLoading,
    setFormError,
    clearFormError,
    updateTransientToken,
    updateTokenValidationResponse,
    updateAuthenticationSetupResponse,
    setPaymentProcessing,
    cardholderName,
    microformInstance,
    transientToken,
    tokenValidationResponse,
    updateCurrentStep,
  } = usePaymentForm();

  const { debugStatus } = useDebug();

  // Get transient token from Redux store at the top level
  const storeTransientToken = useSelector(selectTransientToken);

  const [getCaptureContext, { isLoading: isGettingContext }] = useGetCaptureContextMutation();
  const [validateToken, { isLoading: isValidatingToken }] = useValidateTokenMutation();
  const [setupAuthentication, { isLoading: isSettingUpAuth }] = useSetupAuthenticationMutation();

  // Fetch capture context
  const fetchCaptureContext = useCallback(async () => {
    try {
      setFormLoading(true);
      clearFormError();
      updateCurrentStep("capture-context");
      dispatch(setLastApiCall(new Date().toLocaleTimeString()));
      dispatch(
        addLog({
          level: "info",
          message: "Fetching capture context",
          data: { endpoint: "/api/v1/flex/microform/capture-context" },
        })
      );

      const result = await getCaptureContext().unwrap();

      dispatch(setApiConnected(true));
      dispatch(
        addLog({
          level: "success",
          message: "Successfully received capture context",
          data: result,
        })
      );

      if (result.status !== "success") {
        throw new Error(result.message || "Failed to get capture context");
      }

      updateFlexConfig({
        captureContext: result.data.jwt,
        clientLibrary: result.data.clientLibrary,
        clientLibraryIntegrity: result.data.clientLibraryIntegrity,
      });

      return result;
    } catch (err) {
      console.error("Error fetching capture context:", err);
      const errorMessage = `API Error: ${err.message || "Failed to connect to payment API"}`;
      setFormError(errorMessage);
      dispatch(setApiConnected(false));
      dispatch(addError(errorMessage));
      dispatch(
        addLog({
          level: "error",
          message: "Failed to fetch capture context",
          data: { error: err.message },
        })
      );
      throw err;
    } finally {
      setFormLoading(false);
    }
  }, [getCaptureContext, updateFlexConfig, setFormLoading, setFormError, clearFormError, updateCurrentStep, dispatch]);

  // Validate transient token
  const validateTransientToken = useCallback(
    async (token) => {
      try {
        console.log("🔍 Validating token:", token.substring(0, 30) + "...");
        console.log("🔍 Token length:", token.length);

        updateCurrentStep("token-validation");
        dispatch(
          addLog({
            level: "info",
            message: "Starting token validation",
            data: { tokenPreview: token.substring(0, 30) + "..." },
          })
        );

        const response = await validateToken(token).unwrap();
        console.log("✅ Token validation successful:", response);

        updateTokenValidationResponse(response);
        updateCurrentStep("token-verified");

        dispatch(
          addLog({
            level: "success",
            message: "Token validation successful",
            data: response,
          })
        );

        return response;
      } catch (err) {
        console.error("❌ Error validating token:", err);
        console.error("❌ Error status:", err.status);
        console.error("❌ Error data:", err.data);
        console.error("❌ Full error object:", JSON.stringify(err, null, 2));

        // Try to extract more error details
        if (err.data) {
          console.error("❌ Response body:", err.data);
          if (err.data.message) {
            console.error("❌ Error message:", err.data.message);
          }
          if (err.data.error) {
            console.error("❌ Error details:", err.data.error);
          }
          if (err.data.trace) {
            console.error("❌ Error trace:", err.data.trace);
          }
        }

        const errorMessage = err.data?.message || err.message || `Token validation failed with status ${err.status}`;
        setFormError(errorMessage);
        dispatch(addError(errorMessage));
        dispatch(
          addLog({
            level: "error",
            message: "Token validation failed",
            data: {
              error: errorMessage,
              status: err.status,
              fullError: err,
            },
          })
        );
        throw err;
      }
    },
    [validateToken, updateTokenValidationResponse, updateCurrentStep, setFormError, dispatch]
  );

  // Setup authentication with JTI
  const setupAuthenticationWithJti = useCallback(
    async (jti) => {
      try {
        updateCurrentStep("auth-setup");
        dispatch(
          addLog({
            level: "info",
            message: "Setting up authentication",
            data: { jti },
          })
        );

        const result = await setupAuthentication(jti).unwrap();

        dispatch(
          addLog({
            level: "success",
            message: "Authentication setup successful",
            data: result,
          })
        );

        if (result.status !== "COMPLETED") {
          throw new Error("Authentication setup did not complete successfully");
        }

        updateAuthenticationSetupResponse(result);
        updateCurrentStep("complete");
        return result;
      } catch (err) {
        console.error("Error setting up authentication:", err);

        // Enhanced error parsing for better debugging
        let errorMessage = "Failed to setup authentication";
        let errorDetails = {};

        if (err.status) {
          // RTK Query error with status
          errorMessage = `Authentication Setup Error (${err.status})`;

          if (err.data) {
            try {
              const errorData = typeof err.data === "string" ? JSON.parse(err.data) : err.data;

              if (errorData.message) {
                errorMessage += `: ${errorData.message}`;
              }

              errorDetails = {
                status: err.status,
                timestamp: errorData.timestamp,
                traceId: errorData.traceId,
                path: errorData.path,
                cybersourceId: errorData.cybersourceId,
                cybersourceStatus: errorData.cybersourceStatus,
                cybersourceReason: errorData.cybersourceReason,
                fieldErrors: errorData.fieldErrors,
                originalError: errorData,
              };

              // Add trace ID to error message for support
              if (errorData.traceId) {
                errorMessage += `\nTrace ID: ${errorData.traceId}`;
              }
            } catch (parseError) {
              errorDetails.parseError = "Failed to parse error response";
              errorDetails.rawData = err.data;
            }
          }
        } else if (err.message) {
          errorMessage += `: ${err.message}`;
        }

        setFormError(errorMessage);
        dispatch(addError(errorMessage));
        dispatch(
          addLog({
            level: "error",
            message: "Failed to setup authentication",
            data: {
              error: errorMessage,
              details: errorDetails,
              fullError: err,
            },
          })
        );
        throw err;
      }
    },
    [setupAuthentication, updateAuthenticationSetupResponse, setFormError, updateCurrentStep, dispatch]
  );

  // Load microform script and initialize
  const initializeMicroform = useCallback(() => {
    if (!flexConfig.captureContext || !flexConfig.clientLibrary) return;

    const script = document.createElement("script");
    script.src = flexConfig.clientLibrary;
    script.type = "text/javascript";
    script.async = true;
    script.integrity = flexConfig.clientLibraryIntegrity;
    script.crossOrigin = "anonymous";

    script.onload = () => {
      dispatch(setScriptLoaded(true));
      dispatch(
        addLog({
          level: "success",
          message: "Microform script loaded successfully",
        })
      );

      try {
        const flex = new window.Flex(flexConfig.captureContext);
        const microform = flex.microform("card", {
          styles: {
            input: {
              "font-family": "Inter, system-ui, sans-serif",
              "font-size": "16px",
              color: "#1f2937",
              "font-weight": "normal",
              "line-height": "1.5",
            },
            ":focus": {
              color: "#4338ca",
            },
            ":disabled": {
              cursor: "not-allowed",
              "background-color": "#f3f4f6",
            },
            placeholder: {
              color: "#9ca3af",
            },
            error: {
              color: "#ef4444",
            },
          },
        });

        const number = microform.createField("number", { placeholder: "•••• •••• •••• ••••" });
        const securityCode = microform.createField("securityCode", { placeholder: "•••" });

        number.load("#number-container");
        securityCode.load("#securityCode-container");

        updateMicroformInstance(microform);
        dispatch(setMicroformInitialized(true));
        dispatch(setFieldsLoaded(true));
        dispatch(
          addLog({
            level: "success",
            message: "Microform initialized and fields loaded",
          })
        );
      } catch (err) {
        const errorMessage = `Microform initialization error: ${err.message}`;
        setFormError(errorMessage);
        dispatch(addError(errorMessage));
        dispatch(
          addLog({
            level: "error",
            message: "Failed to initialize microform",
            data: { error: err.message },
          })
        );
      }
    };

    script.onerror = () => {
      const errorMessage = "Failed to load Flex microform script";
      setFormError(errorMessage);
      dispatch(addError(errorMessage));
      dispatch(
        addLog({
          level: "error",
          message: errorMessage,
        })
      );
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [flexConfig, updateMicroformInstance, setFormError, dispatch]);

  // Create transient token only (Step 1)
  const createTransientToken = useCallback(async () => {
    if (!microformInstance) {
      const errorMessage = "Microform not initialized yet. Please wait or refresh the page.";
      setFormError(errorMessage);
      return;
    }

    clearFormError();
    setPaymentProcessing(true);

    try {
      // Validate input fields first
      const expMonth = document.getElementById("expMonth")?.value;
      const expYear = document.getElementById("expYear")?.value;

      if (!expMonth || !expYear) {
        throw new Error("Please select expiration month and year");
      }

      if (!cardholderName || cardholderName.trim().length < 2) {
        throw new Error("Please enter a valid cardholder name");
      }

      console.log("Starting tokenization process...");

      dispatch(
        addLog({
          level: "info",
          message: "Starting tokenization process",
          data: { expMonth, expYear, cardholderName },
        })
      );

      updateCurrentStep("token-creation");

      // Create options object according to CyberSource documentation
      const options = {
        expirationMonth: expMonth,
        expirationYear: expYear,
      };

      // Add cardholder name if available (optional in CyberSource docs)
      if (cardholderName) {
        options.cardholderName = cardholderName;
      }

      console.log("Tokenization options:", options);

      const token = await new Promise((resolve, reject) => {
        try {
          microformInstance.createToken(options, (err, token) => {
            if (err) {
              console.error("Tokenization error:", err);
              reject(new Error(err.message || "Failed to tokenize card"));
            } else {
              resolve(token);
            }
          });
        } catch (err) {
          console.error("Exception during tokenization:", err);
          reject(new Error("Exception during tokenization: " + (err.message || "Unknown error")));
        }
      });

      console.log("Tokenization successful");
      console.log("Raw token object:", token);

      // Extract token value - handle both object and string cases
      let tokenValue;
      if (typeof token === "string") {
        // Token is returned directly as a string
        tokenValue = token;
        console.log("Token is a string, using directly");
      } else if (token && typeof token === "object") {
        // Token is an object, extract from properties
        tokenValue = token.token || token.id;
        console.log("Token is an object, extracted from properties");
      } else {
        tokenValue = null;
        console.log("Token is neither string nor object");
      }

      console.log("Extracted token value:", tokenValue);
      console.log("Token value type:", typeof tokenValue);
      console.log("Token value length:", tokenValue?.length);

      // Store the token in Redux
      console.log("About to call updateTransientToken with:", tokenValue);
      updateTransientToken(tokenValue);
      console.log("updateTransientToken call completed");

      // Set the hidden input value
      const flexResponseInput = document.getElementById("flexresponse");
      if (flexResponseInput) {
        flexResponseInput.value = JSON.stringify(token);
      }

      updateCurrentStep("token-created");

      // Log success with token details
      dispatch(
        addLog({
          level: "success",
          message: "Transient token created successfully - ready for manual verification",
          data: {
            tokenPreview: tokenValue?.substring(0, 30) + "..." || "null",
            tokenLength: tokenValue?.length || 0,
            instruction: "Copy the token below and click 'Verify Transient Token' to proceed",
          },
        })
      );

      console.log("Token creation complete. Token:", tokenValue);
    } catch (err) {
      console.error("Token creation error:", err);
      const errorMessage = err.message || JSON.stringify(err) || "Unknown error during token creation";
      setFormError(errorMessage);
      dispatch(addError(errorMessage));
      dispatch(
        addLog({
          level: "error",
          message: "Failed to create transient token",
          data: { error: errorMessage },
        })
      );
      updateCurrentStep("idle");
    } finally {
      setPaymentProcessing(false);
    }
  }, [microformInstance, cardholderName, updateTransientToken, setFormError, clearFormError, setPaymentProcessing, updateCurrentStep, dispatch]);

  // Verify transient token manually (Step 2)
  const verifyTransientTokenManually = useCallback(async () => {
    console.log("verifyTransientTokenManually called");
    console.log("- transientToken from hook:", transientToken ? "EXISTS" : "NULL");
    console.log("- transientToken from store:", storeTransientToken ? "EXISTS" : "NULL");
    console.log("- hook token length:", transientToken?.length || 0);
    console.log("- store token length:", storeTransientToken?.length || 0);

    if (!transientToken && !storeTransientToken) {
      const errorMessage = "No transient token available. Please create a token first.";
      setFormError(errorMessage);
      dispatch(
        addLog({
          level: "error",
          message: errorMessage,
          data: {
            transientTokenFromHook: transientToken,
            transientTokenFromStore: storeTransientToken,
          },
        })
      );
      return;
    }

    // Use store token if hook token is null
    const tokenToUse = transientToken || storeTransientToken;
    console.log("Using token:", tokenToUse ? "EXISTS" : "NULL");

    clearFormError();
    setPaymentProcessing(true);

    try {
      dispatch(
        addLog({
          level: "info",
          message: "Manual token verification initiated",
          data: { tokenPreview: tokenToUse.substring(0, 30) + "..." },
        })
      );

      const validationResponse = await validateTransientToken(tokenToUse);

      dispatch(
        addLog({
          level: "success",
          message: "Token verification completed - ready for authentication setup",
          data: {
            jti: validationResponse.data.jti,
            instruction: "Click 'Setup Authentication' to proceed",
          },
        })
      );

      updateCurrentStep("token-verified");
    } catch (err) {
      console.error("Error verifying token:", err);
      updateCurrentStep("token-created"); // Go back to token created state
    } finally {
      setPaymentProcessing(false);
    }
  }, [transientToken, storeTransientToken, validateTransientToken, setFormError, clearFormError, setPaymentProcessing, updateCurrentStep, dispatch]);

  // Setup authentication manually (Step 3)
  const setupAuthenticationManually = useCallback(async () => {
    if (!tokenValidationResponse?.data?.jti) {
      const errorMessage = "No JTI available. Please verify the transient token first.";
      setFormError(errorMessage);
      return;
    }

    clearFormError();
    setPaymentProcessing(true);

    try {
      const jti = tokenValidationResponse.data.jti;

      dispatch(
        addLog({
          level: "info",
          message: "Manual authentication setup initiated",
          data: { jti },
        })
      );

      updateCurrentStep("auth-setup");

      const authResponse = await setupAuthenticationWithJti(jti);

      console.log("✅ Authentication setup successful:", authResponse);

      // Set the hidden input value for backward compatibility
      const flexResponseInput = document.getElementById("flexresponse");
      if (flexResponseInput) {
        flexResponseInput.value = JSON.stringify({
          transientToken,
          validationResponse: tokenValidationResponse,
          authResponse,
        });
      }

      // Start device data collection if we have the access token
      if (authResponse.consumerAuthenticationInformation?.accessToken) {
        console.log("🔍 Starting device data collection...");

        dispatch(
          addLog({
            level: "info",
            message: "Starting Cardinal Commerce device data collection",
            data: {
              accessToken: authResponse.consumerAuthenticationInformation.accessToken.substring(0, 20) + "...",
              referenceId: authResponse.consumerAuthenticationInformation.referenceId,
            },
          })
        );

        updateCurrentStep("device-collection");
        startDeviceDataCollection(authResponse.consumerAuthenticationInformation.accessToken);
      } else {
        // No access token, complete the flow
        updateCurrentStep("complete");
        dispatch(
          addLog({
            level: "success",
            message: "Authentication setup completed successfully",
            data: {
              referenceId: authResponse.consumerAuthenticationInformation?.referenceId,
            },
          })
        );
      }
    } catch (err) {
      console.error("Error setting up authentication:", err);
      updateCurrentStep("token-verified"); // Go back to verified state
    } finally {
      setPaymentProcessing(false);
    }
  }, [tokenValidationResponse, setupAuthenticationWithJti, transientToken, setFormError, clearFormError, setPaymentProcessing, updateCurrentStep, dispatch]);

  // Device Data Collection (Step 4)
  const startDeviceDataCollection = useCallback(
    (accessToken) => {
      console.log("🔍 Setting up Cardinal Commerce device data collection...");

      // Create the hidden iframe
      let iframe = document.getElementById("cardinal_collection_iframe");
      if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.id = "cardinal_collection_iframe";
        iframe.name = "collectionIframe";
        iframe.height = "1";
        iframe.width = "1";
        iframe.style.display = "none";
        document.body.appendChild(iframe);
      }

      // Create the hidden form
      let form = document.getElementById("cardinal_collection_form");
      if (!form) {
        form = document.createElement("form");
        form.id = "cardinal_collection_form";
        form.method = "POST";
        form.target = "collectionIframe";
        form.action = "https://centinelapistag.cardinalcommerce.com/V1/Cruise/Collect";

        const input = document.createElement("input");
        input.id = "cardinal_collection_form_input";
        input.type = "hidden";
        input.name = "JWT";
        input.value = accessToken;

        form.appendChild(input);
        document.body.appendChild(form);
      } else {
        // Update the JWT value if form already exists
        const input = document.getElementById("cardinal_collection_form_input");
        if (input) {
          input.value = accessToken;
        }
      }

      // Listen for Cardinal Commerce response
      const messageHandler = (event) => {
        if (event.origin === "https://centinelapistag.cardinalcommerce.com") {
          console.log("✅ Device Data Collection Result:", event.data);

          dispatch(
            addLog({
              level: "success",
              message: "Device data collection completed",
              data: { result: event.data },
            })
          );

          updateCurrentStep("complete");

          // Clean up
          window.removeEventListener("message", messageHandler);

          // Remove the form and iframe
          if (form) form.remove();
          if (iframe) iframe.remove();
        }
      };

      window.addEventListener("message", messageHandler, false);

      // Submit the form
      console.log("🚀 Submitting Cardinal Commerce form...");
      form.submit();

      dispatch(
        addLog({
          level: "info",
          message: "Device data collection form submitted to Cardinal Commerce",
          data: {
            action: "https://centinelapistag.cardinalcommerce.com/V1/Cruise/Collect",
            accessToken: accessToken.substring(0, 20) + "...",
          },
        })
      );
    },
    [dispatch, updateCurrentStep]
  );

  // Complete payment processing flow (Legacy - keeping for backward compatibility)
  const processPayment = useCallback(async () => {
    // For now, just create the token - user will manually verify and setup auth
    await createTransientToken();
  }, [createTransientToken]);

  // Initialize on mount
  useEffect(() => {
    fetchCaptureContext();
  }, [fetchCaptureContext]);

  // Initialize microform when config is ready
  useEffect(() => {
    const cleanup = initializeMicroform();
    return cleanup;
  }, [initializeMicroform]);

  return {
    fetchCaptureContext,
    initializeMicroform,
    processPayment,
    createTransientToken,
    verifyTransientTokenManually,
    setupAuthenticationManually,
    validateTransientToken,
    setupAuthenticationWithJti,
    isGettingContext,
    isValidatingToken,
    isSettingUpAuth,
    debugStatus,
  };
};
