import React, { useMemo, useState } from 'react';
import CoacheeCalendar from './CoacheeCalendarContext';

function CoacheeCalendarContextWrapper({ children }) {
  const [date, setDate] = useState(null);
  const [hour, setHour] = useState(null);

  const CoacheeCalendarValue = useMemo(
    () => ({
      date,
      hour,
      setDate,
      setHour
    }),
    [date, hour]
  );

  return (
    <CoacheeCalendar.Provider value={CoacheeCalendarValue}>
      {children}
    </CoacheeCalendar.Provider>
  );
}

export default CoacheeCalendarContextWrapper;
