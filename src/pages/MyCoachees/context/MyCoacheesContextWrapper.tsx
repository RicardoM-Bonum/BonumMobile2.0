import React, { useMemo, useState } from 'react';
import MyCoacheesContext from './MyCoacheesContext';

function MyCoacheesContextWrapper({ children }) {
  const [selectedCoachee, setSelectedCoachee] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);

  const MyCoacheesContextValue = useMemo(
    () => ({
      selectedCoachee,
      selectedSession,
      setSelectedCoachee,
      setSelectedSession
    }),
    [selectedCoachee, selectedSession]
  );

  return (
    <MyCoacheesContext.Provider value={MyCoacheesContextValue}>
      {children}
    </MyCoacheesContext.Provider>
  );
}

export default MyCoacheesContextWrapper;
