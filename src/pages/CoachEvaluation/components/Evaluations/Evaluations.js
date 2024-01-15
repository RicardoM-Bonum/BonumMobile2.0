import { View, Text, ScrollView } from 'react-native';
import tw from 'twrnc';
import React, { useEffect } from 'react';
import { useState } from 'react';
import EvaluationContent from './components/EvaluationContent';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { filter, size } from 'lodash';
import evaluationCoachAdapted from '../../../../adapters/evaluationCoach.adapter';
import NoData from '../../../../components/NoData/NoData';
import BasicLayout from '../../../../layouts/BasicLayout';

export default function Evaluations({ isSession }) {
  const titletText = isSession ? 'sesiones' : 'coach';
  const [displayedEvaluations, setDisplayedEvaluations] = useState([]);
  const { ratingCoach, sessions } = useSelector((state) => state.user);
  const { t } = useTranslation('global');

  const getRatingSessionsCoach = () => {
    const filtered = filter(sessions, {
      status: true,
      evaluatedByCoachee: true
    });

    const adaptedEvaluations = filtered.map((evaluation) =>
      evaluationCoachAdapted(evaluation)
    );

    setDisplayedEvaluations(adaptedEvaluations);
  };

  const getRatingCoach = () => {
    const ratings = ratingCoach
      .map((rating) => {
        const session = filter(sessions, { _id: rating.SessionId });
        if (session.length < 1) return false;

        return {
          id: session[0]._id,
          image: session[0]?.coachee?.urlImgCoachee,
          name: `${session[0]?.coachee?.name} ${session[0]?.coachee?.lastname}`,
          date: session[0]?.date,
          comment: session[0]?.commentCoachee,
          value: rating.Score
        };
      })
      .filter((rating) => rating);

    setDisplayedEvaluations(ratings);
  };

  useEffect(() => {
    if (isSession) {
      getRatingSessionsCoach();
      return;
    }

    getRatingCoach();
  }, [ratingCoach, sessions, isSession]);

  return (
    <ScrollView>
      <BasicLayout>
        <View style={tw.style('px-8 py-8')}>
          <Text
            style={tw.style('text-center mb-6 font-bold text-lg text-black')}
          >
            {t('pages.coachEvaluation.title', { titletText: titletText })}
          </Text>

          {size(displayedEvaluations) > 0 ? (
            displayedEvaluations.map((evaluation, index) => (
              <EvaluationContent
                evaluation={evaluation}
                isSession={isSession}
                key={`evaluation-${index}`}
              />
            ))
          ) : (
            <NoData title={t('pages.coachEvaluation.noData')} />
          )}
        </View>
      </BasicLayout>
    </ScrollView>
  );
}
