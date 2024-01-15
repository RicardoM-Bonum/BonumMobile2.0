import React, { useEffect, useMemo, useState } from 'react';
import SessionInfo from './SessionInfoContext';

function SessionInfoContextWrapper({ children }) {
  const [selectedSession, setSelectedSession] = useState(null);
  const SessionInfoValue = useMemo(
    () => ({
      selectedSession,
      setSelectedSession
    }),
    [selectedSession]
  );

  useEffect(() => {}, [selectedSession]);

  return (
    <SessionInfo.Provider value={SessionInfoValue}>
      {children}
    </SessionInfo.Provider>
  );
}

export default SessionInfoContextWrapper;
