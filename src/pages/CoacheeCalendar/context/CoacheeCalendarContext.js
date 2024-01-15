import { createContext } from 'react';

const CoacheeCalendar = createContext({
  date: '',
  hour: '',
  setDate: () => null,
  setHour: () => null
});

export default CoacheeCalendar;
