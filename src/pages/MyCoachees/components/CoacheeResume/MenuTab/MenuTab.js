import { View } from 'react-native';
import React, { useContext } from 'react';
import Sessions from './screens/Sessions';
import Tabs from '../../../../../components/Tabs';
import { SceneMap } from 'react-native-tab-view';
import { HScrollView } from 'react-native-head-tab-view';
import { useTranslation } from 'react-i18next';
import Evaluation from '../../../../../components/Evaluation';
import CoacheeResumeContext from '../context/CoacheeResumeContext';
import Comments from './screens/Comments';

export default function MenuTab(props) {
  const { header } = props;
  const { t } = useTranslation('global');
  const { coachee } = useContext(CoacheeResumeContext);

  const sessionsRoute = () => (
    <HScrollView index={0}>
      <Sessions />
    </HScrollView>
  );

  const autoevaluationRoute = () => (
    <HScrollView index={1}>
      <Evaluation
        type="autoevaluation"
        coachee={coachee?._id}
        title={t('pages.myEvaluations.tabAutoevaluation')}
      />
    </HScrollView>
  );

  const evaluation360Route = () => (
    <HScrollView index={2}>
      <Evaluation
        type="evaluation360"
        coachee={coachee?._id}
        title={t('pages.myEvaluations.tab360')}
      />
    </HScrollView>
  );

  const initialCommentsRoute = () => (
    <HScrollView index={3}>
      <Comments
        type="initial"
        coachee={coachee?._id}
        title={t('pages.myEvaluations.tabInitialComments')}
      />
    </HScrollView>
  );

  const finalCommentsRoute = () => (
    <HScrollView index={4}>
      <Comments
        type="final"
        coachee={coachee?._id}
        title={t('pages.myEvaluations.tabFinalComments')}
      />
    </HScrollView>
  );

  const renderScene = SceneMap({
    sessions: sessionsRoute,
    autoevaluation: autoevaluationRoute,
    evaluation360: evaluation360Route,
    initialComments: initialCommentsRoute,
    finalComments: finalCommentsRoute
  });

  const routes = [
    { key: 'sessions', title: `${t('pages.myCoachees.components.sessions')}` },
    {
      key: 'autoevaluation',
      title: `${t('pages.myEvaluations.tabAutoevaluation')}`
    },
    { key: 'evaluation360', title: `${t('pages.myEvaluations.tab360')}` },
    {
      key: 'initialComments',
      title: `${t('pages.myEvaluations.tabInitialComments')}`
    },
    {
      key: 'finalComments',
      title: `${t('pages.myEvaluations.tabFinalComments')}`
    }
  ];

  return (
    <Tabs
      renderScene={renderScene}
      routes={routes}
      heightFull
      header={header}
    />
  );
}
