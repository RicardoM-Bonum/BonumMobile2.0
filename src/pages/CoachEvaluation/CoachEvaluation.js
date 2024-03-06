import {Text, View, TouchableOpacity, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import tw from 'twrnc';
import {Rating} from 'react-native-ratings';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {filter} from 'lodash';

export default function CoachEvaluation({navigation}) {
  const {t} = useTranslation('global');
  const {ratingSessionsCoach, ratingCoach, sessions} = useSelector(
    state => state.user,
  );

  const [evaluations, setEvaluations] = useState([
    {
      id: 1,
      title: t('pages.coachEvaluation.titleEvaluations'),
      ratingValue: 5,
      redirect: 'sessions',
    },
    {
      id: 2,
      title: t('pages.coachEvaluation.titleCoach'),
      ratingValue: 5,
      redirect: 'coach',
    },
  ]);

  const getAverage = () => {
    let averageRatingCoach = 5,
      averageSessionsRating = 5;

    console.log('rating sessions', ratingSessionsCoach);
    if (ratingSessionsCoach.length > 0) {
      averageSessionsRating =
        ratingSessionsCoach.reduce((a, b) => a + b, 0) /
        ratingSessionsCoach.length;
    }

    console.log('rating coach', ratingCoach);

    if (ratingCoach.length > 0) {
      const rating = ratingCoach
        .map(evaluation => {
          const session = filter(sessions, {_id: evaluation.SessionId});
          if (session.length < 1) {
            return false;
          }

          return evaluation.Score;
        })
        .filter(evaluation => evaluation);

      averageRatingCoach = rating.reduce((a, b) => a + b, 0) / rating.length;
    }

    setEvaluations([
      {
        id: 1,
        title: t('pages.coachEvaluation.titleEvaluations'),
        ratingValue: averageSessionsRating,
        redirect: 'sessions',
      },
      {
        id: 2,
        title: t('pages.coachEvaluation.titleCoach'),
        ratingValue: averageRatingCoach,
        redirect: 'coach',
      },
    ]);
  };

  useEffect(() => {
    getAverage();
  }, [ratingSessionsCoach, ratingCoach]);

  return (
    <View style={tw.style('bg-[#E4EFF8e8] px-8 py-8 min-h-full')}>
      <Text style={tw.style('text-center mb-6 font-bold text-lg text-black')}>
        {t('components.menu.myEvaluations')}
      </Text>
      <View>
        {evaluations.map(evaluation => {
          const redirect =
            evaluation.redirect === 'sessions'
              ? 'Evaluations'
              : 'EvaluationsCoach';
          return (
            <View key={evaluation.id} style={tw.style('mb-6')}>
              <View
                style={tw.style(
                  'bg-white shadow-md rounded-2xl px-6 py-4 mb-2',
                )}>
                <Text style={tw.style('text-lg text-[#60636A]')}>
                  {evaluation && evaluation.title}
                </Text>
                <Rating
                  fractions={5}
                  readonly
                  startingValue={evaluation.ratingValue || 5}
                  style={tw.style('-ml-10 mt-2')}
                />
              </View>
              <TouchableOpacity onPress={() => navigation.navigate(redirect)}>
                <Text style={tw.style('underline text-[#60636A]')}>
                  {t('pages.coachEvaluation.button')}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
}
