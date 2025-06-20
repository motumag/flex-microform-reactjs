import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import { selectDebugStatus, selectErrors, selectLogs, selectApiCallCount, addError, removeError, clearErrors, addLog, clearLogs, resetDebug } from "../store/slices/debugSlice";

export const useDebug = () => {
  const dispatch = useDispatch();

  // Selectors
  const debugStatus = useSelector(selectDebugStatus);
  const errors = useSelector(selectErrors);
  const logs = useSelector(selectLogs);
  const apiCallCount = useSelector(selectApiCallCount);

  // Actions
  const logError = useCallback(
    (message) => {
      dispatch(addError(message));
    },
    [dispatch]
  );

  const deleteError = useCallback(
    (id) => {
      dispatch(removeError(id));
    },
    [dispatch]
  );

  const clearAllErrors = useCallback(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  const log = useCallback(
    (level, message, data = null) => {
      dispatch(addLog({ level, message, data }));
    },
    [dispatch]
  );

  const clearAllLogs = useCallback(() => {
    dispatch(clearLogs());
  }, [dispatch]);

  const resetAllDebug = useCallback(() => {
    dispatch(resetDebug());
  }, [dispatch]);

  // Utility functions
  const getStatusColor = useCallback((status) => {
    return status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  }, []);

  const getStatusText = useCallback((status) => {
    return status ? "Yes" : "No";
  }, []);

  const getNetworkStatusColor = useCallback((status) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "loading":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }, []);

  const formatTimestamp = useCallback((timestamp) => {
    try {
      return new Date(timestamp).toLocaleTimeString();
    } catch (e) {
      return timestamp;
    }
  }, []);

  const exportDebugInfo = useCallback(() => {
    const debugData = {
      timestamp: new Date().toISOString(),
      status: debugStatus,
      errors,
      logs,
      apiCallCount,
    };

    const dataStr = JSON.stringify(debugData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `debug-info-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [debugStatus, errors, logs, apiCallCount]);

  return {
    // State
    debugStatus,
    errors,
    logs,
    apiCallCount,

    // Actions
    logError,
    deleteError,
    clearAllErrors,
    log,
    clearAllLogs,
    resetAllDebug,

    // Utilities
    getStatusColor,
    getStatusText,
    getNetworkStatusColor,
    formatTimestamp,
    exportDebugInfo,
  };
};
