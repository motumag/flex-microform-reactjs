// API Types
export const ApiStatus = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

// Log Levels
export const LogLevel = {
  INFO: "info",
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
};

// Payment Form States
export const PaymentState = {
  IDLE: "idle",
  LOADING: "loading",
  PROCESSING: "processing",
  SUCCESS: "success",
  ERROR: "error",
};

// CyberSource Constants
export const CyberSourceConfig = {
  SUPPORTED_CARD_NETWORKS: ["VISA", "MASTERCARD", "AMEX", "DISCOVER"],
  CLIENT_VERSION: "v2",
  DEFAULT_TARGET_ORIGINS: ["https://lfj734qc-3000.euw.devtunnels.ms/", "https://localhost:3000"],
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8081",
  ENDPOINTS: {
    CAPTURE_CONTEXT: "/api/v1/flex/microform/capture-context",
    PROCESS_PAYMENT: "/payment/process",
    VALIDATE_TOKEN: "/api/v1/flex/microform/verifyTransientToken",
    AUTHENTICATION_SETUP: "/api/v1/risk/v1/authentication-setups",
  },
};

// Debug Status Types
export const DEBUG_STATUS = {
  API_CONNECTED: "API_CONNECTED",
  SCRIPT_LOADED: "SCRIPT_LOADED",
  MICROFORM_INITIALIZED: "MICROFORM_INITIALIZED",
  FIELDS_LOADED: "FIELDS_LOADED",
};

// Log Levels
export const LOG_LEVELS = {
  INFO: "info",
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
};

// Payment Flow Steps
export const PAYMENT_STEPS = {
  IDLE: "idle",
  CAPTURE_CONTEXT: "capture-context",
  TOKEN_CREATION: "token-creation",
  TOKEN_VALIDATION: "token-validation",
  AUTH_SETUP: "auth-setup",
  COMPLETE: "complete",
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SUCCESS: "success",
  FAILED: "failed",
};

// Validation Rules
export const VALIDATION_RULES = {
  CARDHOLDER_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
    PATTERN: /^[a-zA-Z\s.-]+$/,
  },
  EXPIRATION: {
    MONTHS: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
    YEARS: [2025, 2026, 2027, 2028, 2029, 2030],
  },
};
