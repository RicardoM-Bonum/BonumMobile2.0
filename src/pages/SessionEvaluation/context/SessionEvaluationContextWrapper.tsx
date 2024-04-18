import React, {useEffect, useMemo, useState} from 'react';
import {useSelector} from 'react-redux';
import SessionEvaluationContext from './SessionEvaluationContext';
import {useTranslation} from 'react-i18next';

function SessionEvaluationContextWrapper({children}) {
  const {role} = useSelector(state => state.user);
  const [questions, setQuestions] = useState([]);

  const {t} = useTranslation('global');

  const questionCoachee = [
    {
      id: 1,
      title: t('pages.sessionEvaluation.coachee.rateCoachingSession'),
      ratingValue: 0,
    },
    {
      id: 2,
      title: t('pages.sessionEvaluation.coachee.rateCoach'),
      ratingValue: 0,
    },
    {
      id: 3,
      title: t('pages.sessionEvaluation.coachee.callQuality'),
      ratingValue: 0,
    },
  ];

  const questionCoach = [
    {
      id: 1,
      title: t('pages.sessionEvaluation.coach.callQuality'),
      ratingValue: 0,
    },
    {
      id: 2,
      title: t('pages.sessionEvaluation.coach.rateCoachee'),
      ratingValue: 0,
    },
    {
      id: 3,
      title: t('pages.sessionEvaluation.coach.callQuality'),
      ratingValue: 0,
    },
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
      resetQuestions,
    }),
    [questions, setQuestions, resetQuestions],
  );

  return (
    <SessionEvaluationContext.Provider value={SessionEvaluationContextValue}>
      {children}
    </SessionEvaluationContext.Provider>
  );
}

export default SessionEvaluationContextWrapper;
