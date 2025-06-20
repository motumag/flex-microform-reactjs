import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:8081";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["CaptureContext", "Token", "Authentication"],
  endpoints: (builder) => ({
    // Get capture context for Flex microform
    getCaptureContext: builder.mutation({
      query: (targetOrigins = []) => ({
        url: "/api/v1/flex/microform/capture-context",
        method: "POST",
        body: {
          targetOrigins: targetOrigins.length > 0 ? targetOrigins : [window.location.origin, "https://lfj734qc-3000.euw.devtunnels.ms", "http://localhost:3000"],
          allowedCardNetworks: ["VISA", "MASTERCARD"],
          clientVersion: "v2",
        },
      }),
      invalidatesTags: ["CaptureContext"],
    }),

    // Validate transient token and get JTI
    validateToken: builder.mutation({
      query: (transientToken) => {
        const requestBody = {
          transientToken: transientToken,
        };

        console.log("🔍 API Request Debug:");
        console.log("- URL:", "/api/v1/flex/microform/verifyTransientToken");
        console.log("- Method:", "POST");
        console.log("- Content-Type:", "application/json");
        console.log("- Body:", JSON.stringify(requestBody, null, 2));
        console.log("- Token length:", transientToken?.length);

        return {
          url: "/api/v1/flex/microform/verifyTransientToken",
          method: "POST",
          body: requestBody,
        };
      },
      invalidatesTags: ["Token"],
    }),

    // Setup authentication using JTI
    setupAuthentication: builder.mutation({
      query: (jti) => ({
        url: "/api/v1/risk/v1/authentication-setups",
        method: "POST",
        body: {
          transientTokenJti: jti,
        },
      }),
      invalidatesTags: ["Authentication"],
    }),

    // Process payment (if you have additional payment processing endpoints)
    processPayment: builder.mutation({
      query: (paymentData) => ({
        url: "/payment/process",
        method: "POST",
        body: paymentData,
      }),
      invalidatesTags: ["Token"],
    }),
  }),
});

export const { useGetCaptureContextMutation, useValidateTokenMutation, useSetupAuthenticationMutation, useProcessPaymentMutation } = paymentApi;
