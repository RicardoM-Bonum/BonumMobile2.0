import { createContext } from 'react';

const CoacheeResumeContext = createContext({
  coachee: {},
  setCoachee: () => null
});

export default CoacheeResumeContext;
