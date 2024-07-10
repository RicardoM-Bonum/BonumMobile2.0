import {View, Text, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import EvaluationArea from '../EvaluationArea';
import NoData from '../NoData/NoData';
import tw from 'twrnc';
import {useFetchAndLoad} from '../../hooks';
import {useTranslation} from 'react-i18next';
import {
  getAutoEvaluationByCoacheeId,
  getEvaluation360ByCoacheeId,
} from '../../services/evaluations.service';
import displayToast from '../../utilities/toast.utility';
import {find, findIndex, findLastIndex, forEach, map, size} from 'lodash';
import Loading from '../Loading';
import {mongoDateToShortDate} from '../../utilities';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function Evaluation(props) {
  const [evaluations, setEvaluations] = useState([]);
  const [focusAreas, setFocusAreas] = useState([]);
  const {loading, callEndpoint} = useFetchAndLoad();
  const [finalEvaluationIndex, setFinalEvaluationIndex] = useState(0);

  const {t} = useTranslation('global');
  const errorGet = t('components.evaluation.errorGet');
  const error360 = t('components.evaluation.error360');
  const {title, type, coachee} = props;

  const getAutoevaluations = async () => {
    try {
      const {data} = await callEndpoint(getAutoEvaluationByCoacheeId(coachee));
      setEvaluations(data.data);
    } catch (error) {
      displayToast(errorGet, 'error');
    }
  };

  const getEvaluations360 = async () => {
    try {
      const {data} = await callEndpoint(getEvaluation360ByCoacheeId(coachee));
      setEvaluations(data.data);
    } catch (error) {
      displayToast(error360, 'error');
    }
  };

  const getFinalEvaluation = () => {
    setFinalEvaluationIndex(
      findLastIndex(
        evaluations,
        evaluation => evaluation.evaluationType === 'final',
      ),
    );
  };

  const getAnswersGroupedByFocusAreas = () => {
    const focusAreasTemp = [];

    forEach(evaluations, evaluation => {
      const isInitialEvaluation = evaluation.evaluationType === 'initial';

      forEach(evaluation?.answers, answer => {
        const indexOfFocusArea = findIndex(
          focusAreasTemp,
          focusArea => focusArea?._id === answer?.question?.focusArea?._id,
        );

        if (indexOfFocusArea < 0) {
          focusAreasTemp.push({
            _id: answer?.question?.focusArea?._id,
            title: answer?.question?.focusArea?.focusArea,
            image: answer?.question?.focusArea?.urlImgFocusArea,
            en: answer?.question?.focusArea?.en,
            pt: answer?.question?.focusArea?.pt,
            questions: [
              {
                _id: answer.question._id,
                title: answer.question.question,
                en: answer.question.en,
                pt: answer.question.pt,
                initialEvaluation: isInitialEvaluation ? answer.value : 0,
                finalEvaluation: !isInitialEvaluation ? answer.value : 0,
                initialAnswers: isInitialEvaluation ? 1 : 0,
                finalAnswers: !isInitialEvaluation ? 1 : 0,
              },
            ],
            totalInitialEvaluation: isInitialEvaluation ? answer.value : 0,
            totalFinalEvaluation: !isInitialEvaluation ? answer.value : 0,
            totalInitialAnswers: isInitialEvaluation ? 1 : 0,
            totalFinalAnswers: !isInitialEvaluation ? 1 : 0,
          });
        } else {
          if (isInitialEvaluation) {
            focusAreasTemp[indexOfFocusArea].totalInitialEvaluation +=
              answer.value;
            focusAreasTemp[indexOfFocusArea].totalInitialAnswers += 1;
          } else {
            focusAreasTemp[indexOfFocusArea].totalFinalEvaluation +=
              answer.value;
            focusAreasTemp[indexOfFocusArea].totalFinalAnswers += 1;
          }

          const question = find(
            focusAreasTemp[indexOfFocusArea].questions,
            savedQuestion => savedQuestion._id === answer.question._id,
          );

          if (!question) {
            focusAreasTemp[indexOfFocusArea].questions.push({
              _id: answer.question._id,
              title: answer.question.question,
              en: answer.question.en,
              pt: answer.question.pt,
              initialEvaluation: isInitialEvaluation ? answer.value : 0,
              finalEvaluation: !isInitialEvaluation ? answer.value : 0,
              initialAnswers: isInitialEvaluation ? 1 : 0,
              finalAnswers: !isInitialEvaluation ? 1 : 0,
            });

            return;
          }

          focusAreasTemp[indexOfFocusArea].questions = map(
            focusAreasTemp[indexOfFocusArea].questions,
            savedQuestion => {
              if (savedQuestion._id !== answer.question._id) {
                return savedQuestion;
              }

              return {
                ...savedQuestion,
                initialEvaluation: isInitialEvaluation
                  ? savedQuestion.initialEvaluation + answer.value
                  : savedQuestion.initialEvaluation,
                finalEvaluation: !isInitialEvaluation
                  ? savedQuestion.finalEvaluation + answer.value
                  : savedQuestion.finalEvaluation,
                initialAnswers: isInitialEvaluation
                  ? savedQuestion.initialAnswers + 1
                  : savedQuestion.initialAnswers,
                finalAnswers: !isInitialEvaluation
                  ? savedQuestion.finalAnswers + 1
                  : savedQuestion.finalAnswers,
              };
            },
          );
        }
      });
    });

    setFocusAreas(focusAreasTemp);
  };

  useEffect(() => {
    if (coachee) {
      if (type === 'autoevaluation') {
        getAutoevaluations();
      }

      if (type === 'evaluation360') {
        getEvaluations360();
      }
    }
  }, []);

  useEffect(() => {
    getAnswersGroupedByFocusAreas();
    getFinalEvaluation();
  }, [evaluations]);

  if (loading) {
    return <Loading title={t('components.evaluation.loading')} />;
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      {focusAreas.length > 0 && (
        <View style={tw.style('mb-6')}>
          <View style={tw.style('flex-row justify-between mb-4')}>
            <View>
              <Text style={tw.style('font-bold text-black')}>
                {t('components.evaluation.start')}
              </Text>
              <Text style={tw.style('text-[#299eff]')}>
                {mongoDateToShortDate(evaluations[0]?.dateSended)}
              </Text>
            </View>
            <View>
              <Text style={tw.style('font-bold text-black')}>
                {t('components.evaluation.end')}
              </Text>
              <Text style={tw.style('text-[#299eff]')}>
                {finalEvaluationIndex >= 0
                  ? mongoDateToShortDate(
                      evaluations[finalEvaluationIndex]?.dateSended,
                    )
                  : 'dd-mm-yyy'}
              </Text>
            </View>
          </View>
          <Text style={tw.style('text-center font-bold text-black text-lg')}>
            {title}
          </Text>
        </View>
      )}

      {focusAreas.length > 0 ? (
        focusAreas.map(focusArea => (
          <EvaluationArea focusArea={focusArea} key={focusArea._id} />
        ))
      ) : (
        <NoData title={t('pages.coachEvaluation.noData')} />
      )}
    </SafeAreaView>
  );
}
