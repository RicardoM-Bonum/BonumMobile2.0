import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import SessionEvaluationContext from './SessionEvaluationContext';

function SessionEvaluationContextWrapper({ children }) {
  const { role } = useSelector((state) => state.user);
  const [questions, setQuestions] = useState([]);
  const questionCoachee = [
    { id: 1, title: 'Califica tu sesión de coaching', ratingValue: 0 },
    { id: 2, title: 'Califica a tu coachee', ratingValue: 0 },
    { id: 3, title: '¿Cómo estuvo la calidad de la llamada?', ratingValue: 0 }
  ];

  const questionCoach = [
    { id: 1, title: 'Califica tu sesión de coaching', ratingValue: 0 },
    { id: 2, title: 'Califica el compromiso de tu coachee', ratingValue: 0 },
    { id: 3, title: '¿Cómo estuvo la calidad de la llamada?', ratingValue: 0 }
  ];

  const resetQuestions = () => {
    if (role === 'coach') {
      setQuestions(questionCoach);
    } else {
      setQuestions(questionCoachee);
    }
  };

  useEffect(() => {
    if (role === 'coach') {
      setQuestions(questionCoach);
    } else {
      setQuestions(questionCoachee);
    }
  }, [role]);

  useEffect(() => {}, [questions]);

  const SessionEvaluationContextValue = useMemo(
    () => ({
      questions,
      setQuestions,
      resetQuestions
    }),
    [questions, setQuestions, resetQuestions]
  );

  return (
    <SessionEvaluationContext.Provider value={SessionEvaluationContextValue}>
      {children}
    </SessionEvaluationContext.Provider>
  );
}

export default SessionEvaluationContextWrapper;
