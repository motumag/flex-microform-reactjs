import React from 'react';
import { useDebug } from '../../hooks/useDebug';

const DebugStatus = () => {
  const { debugStatus, getStatusColor, getStatusText } = useDebug();

  const statusItems = [
    { label: 'API Connected', value: debugStatus.apiConnected },
    { label: 'Script Loaded', value: debugStatus.scriptLoaded },
    { label: 'Microform Initialized', value: debugStatus.microformInitialized },
    { label: 'Fields Loaded', value: debugStatus.fieldsLoaded },
  ];

  return (
    <div className="flex flex-col gap-2">
      <h4 className="font-semibold text-gray-700 mb-1">Status Indicators</h4>
      {statusItems.map((item) => (
        <div
          key={item.label}
          className={`px-2 py-1 rounded-md ${getStatusColor(item.value)} flex justify-between text-xs`}
        >
          <span>{item.label}</span>
          <span>{getStatusText(item.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default DebugStatus; 