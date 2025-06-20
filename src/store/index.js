import { configureStore } from "@reduxjs/toolkit";
import { paymentApi } from "./api/paymentApi";
import paymentFormReducer from "./slices/paymentFormSlice";
import debugReducer from "./slices/debugSlice";

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [paymentApi.reducerPath]: paymentApi.reducer,
    paymentForm: paymentFormReducer,
    debug: debugReducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [paymentApi.util.resetApiState.type],
        // Ignore these field paths in all actions
        ignoredActionsPaths: ["meta.arg", "payload.timestamp"],
        // Ignore these paths in the state
        ignoredPaths: ["paymentForm.microformInstance"],
      },
    }).concat(paymentApi.middleware),
});
