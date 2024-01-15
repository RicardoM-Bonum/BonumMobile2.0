import React, { useEffect, useMemo, useState } from 'react';
import CoacheeResumeContext from './CoacheeResumeContext';

function CoacheeResumeContextWrapper({ children }) {
  const [coachee, setCoachee] = useState();
  const CoacheeResumeContextValue = useMemo(
    () => ({
      coachee,
      setCoachee
    }),
    [coachee]
  );

  useEffect(() => {}, [coachee]);

  return (
    <CoacheeResumeContext.Provider value={CoacheeResumeContextValue}>
      {children}
    </CoacheeResumeContext.Provider>
  );
}

export default CoacheeResumeContextWrapper;
