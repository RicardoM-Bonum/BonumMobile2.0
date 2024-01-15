import React, { useMemo, useState } from 'react';
import ScheduleContext from './ScheduleContext';

function ScheduleContextWrapper({ children }) {
  const [date, setDate] = useState(null);
  const [hour, setHour] = useState(null);

  const ScheduleContextValue = useMemo(
    () => ({
      date,
      hour,
      setDate,
      setHour
    }),
    [date, hour]
  );

  return (
    <ScheduleContext.Provider value={ScheduleContextValue}>{children}</ScheduleContext.Provider>
  );
}

export default ScheduleContextWrapper;
