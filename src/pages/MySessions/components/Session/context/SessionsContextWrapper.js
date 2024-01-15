import React, { useEffect, useMemo, useState } from 'react';
import MySessionsContext from './SessionsContext';

function SessionContextWrapper({ children }) {
  const [selectedSession, setSelectedSession] = useState(null);
  const MySessionsContextValue = useMemo(
    () => ({
      selectedSession,
      setSelectedSession
    }),
    [selectedSession]
  );

  useEffect(() => {}, [selectedSession]);

  return (
    <MySessionsContext.Provider value={MySessionsContextValue}>
      {children}
    </MySessionsContext.Provider>
  );
}

export default SessionContextWrapper;
