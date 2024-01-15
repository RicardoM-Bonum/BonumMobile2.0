import { createContext } from 'react';

const ScheduleContext = createContext({
  date: '',
  hour: '',
  setDate: () => null,
  setHour: () => null
});

export default ScheduleContext;
