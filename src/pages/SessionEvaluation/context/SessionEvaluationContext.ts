import { createContext } from 'react';

const SessionEvaluationContext = createContext({
  questions: [],
  setQuestions: () => null,
  resetQuestions: () => null
});

export default SessionEvaluationContext;
