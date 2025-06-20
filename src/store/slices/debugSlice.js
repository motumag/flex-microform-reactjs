import { createSlice, createSelector } from "@reduxjs/toolkit";

const initialState = {
  scriptLoaded: false,
  microformInitialized: false,
  fieldsLoaded: false,
  apiConnected: false,
  lastApiCall: null,
  apiCallCount: 0,
  errors: [],
  logs: [],
  networkStatus: "idle", // 'idle', 'loading', 'success', 'error'
};

const debugSlice = createSlice({
  name: "debug",
  initialState,
  reducers: {
    setScriptLoaded: (state, action) => {
      state.scriptLoaded = action.payload;
    },
    setMicroformInitialized: (state, action) => {
      state.microformInitialized = action.payload;
    },
    setFieldsLoaded: (state, action) => {
      state.fieldsLoaded = action.payload;
    },
    setApiConnected: (state, action) => {
      state.apiConnected = action.payload;
    },
    setLastApiCall: (state, action) => {
      state.lastApiCall = action.payload;
      state.apiCallCount += 1;
    },
    setNetworkStatus: (state, action) => {
      state.networkStatus = action.payload;
    },
    addError: (state, action) => {
      state.errors.push({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        message: action.payload,
      });
    },
    removeError: (state, action) => {
      state.errors = state.errors.filter((error) => error.id !== action.payload);
    },
    clearErrors: (state) => {
      state.errors = [];
    },
    addLog: (state, action) => {
      state.logs.push({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        level: action.payload.level || "info",
        message: action.payload.message,
        data: action.payload.data,
      });
      // Keep only last 50 logs
      if (state.logs.length > 50) {
        state.logs = state.logs.slice(-50);
      }
    },
    clearLogs: (state) => {
      state.logs = [];
    },
    resetDebug: () => initialState,
  },
});

export const { setScriptLoaded, setMicroformInitialized, setFieldsLoaded, setApiConnected, setLastApiCall, setNetworkStatus, addError, removeError, clearErrors, addLog, clearLogs, resetDebug } =
  debugSlice.actions;

export default debugSlice.reducer;

// Base selectors
export const selectScriptLoaded = (state) => state.debug.scriptLoaded;
export const selectMicroformInitialized = (state) => state.debug.microformInitialized;
export const selectFieldsLoaded = (state) => state.debug.fieldsLoaded;
export const selectApiConnected = (state) => state.debug.apiConnected;
export const selectLastApiCall = (state) => state.debug.lastApiCall;
export const selectApiCallCount = (state) => state.debug.apiCallCount;
export const selectNetworkStatus = (state) => state.debug.networkStatus;
export const selectErrors = (state) => state.debug.errors;
export const selectLogs = (state) => state.debug.logs;

// Memoized selector to prevent unnecessary re-renders
export const selectDebugStatus = createSelector(
  [selectScriptLoaded, selectMicroformInitialized, selectFieldsLoaded, selectApiConnected, selectLastApiCall, selectNetworkStatus],
  (scriptLoaded, microformInitialized, fieldsLoaded, apiConnected, lastApiCall, networkStatus) => ({
    scriptLoaded,
    microformInitialized,
    fieldsLoaded,
    apiConnected,
    lastApiCall,
    networkStatus,
  })
);
