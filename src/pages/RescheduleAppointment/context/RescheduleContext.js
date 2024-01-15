import { createContext } from 'react';

const RescheduleContext = createContext({
  date: '',
  hour: '',
  setDate: () => null,
  setHour: () => null
});

export default RescheduleContext;
