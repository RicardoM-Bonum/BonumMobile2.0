import { createContext } from 'react';

const SessionContext = createContext({
  selectedSession: {},
  setSelectedSession: () => null
});

export default SessionContext;
