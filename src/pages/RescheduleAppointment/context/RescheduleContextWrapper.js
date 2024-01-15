import React, { useMemo, useState } from 'react';
import RescheduleContext from './RescheduleContext';

function RescheduleContextWrapper({ children }) {
  const [date, setDate] = useState(null);
  const [hour, setHour] = useState(null);

  const RescheduleContextValue = useMemo(
    () => ({
      date,
      hour,
      setDate,
      setHour
    }),
    [date, hour]
  );

  return (
    <RescheduleContext.Provider value={RescheduleContextValue}>
      {children}
    </RescheduleContext.Provider>
  );
}

export default RescheduleContextWrapper;
