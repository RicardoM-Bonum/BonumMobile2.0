import { createContext } from 'react';

const MyCoacheesContext = createContext({
  selectedSession: null,
  selectedCoachee: null,
  setSelectedSession: () => null,
  setSelectedCoachee: () => null
});

export default MyCoacheesContext;
