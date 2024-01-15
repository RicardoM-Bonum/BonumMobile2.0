import { createContext } from 'react';

const SessionInfoContext = createContext({
  selectedSession: {},
  setSelectedSession: () => null
});

export default SessionInfoContext;
