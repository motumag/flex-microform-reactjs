import React from 'react';
import { useDebug } from '../../hooks/useDebug';
import DebugStatus from './DebugStatus';
import ApiStatus from './ApiStatus';
import ConfigurationDisplay from './ConfigurationDisplay';

const DebugPanel = () => {
  const { exportDebugInfo } = useDebug();

  return (
    <div className="bg-white rounded-xl shadow-card">
      <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <span className="mr-2">🔧</span>
            System Debug
          </h2>
        </div>
        <button
          onClick={exportDebugInfo}
          className="px-3 py-1 text-xs bg-primary-100 text-primary-700 rounded hover:bg-primary-200 transition-colors"
        >
          Export Debug Data
        </button>
      </div>
      
      <div className="p-5 space-y-6">
        <DebugStatus />
        <ApiStatus />
        <ConfigurationDisplay />
      </div>
    </div>
  );
};

export default DebugPanel; 