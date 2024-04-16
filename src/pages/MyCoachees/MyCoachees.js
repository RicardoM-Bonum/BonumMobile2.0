import * as React from 'react';
import {SceneMap} from 'react-native-tab-view';
import Tabs from '../../components/Tabs';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import {HScrollView} from 'react-native-head-tab-view';
import CoacheeStatus from './components/CoacheeStatus';

export default function MyEvaluations({navigation}) {
  const {t} = useTranslation('global');
  const routes = [
    {
      key: 'autoevaluation',
      title: t('pages.myCoachees.components.Active'),
    },
    {key: 'evaluation360', title: t('pages.myCoachees.components.Unactive')},
  ];

  const autoevaluationRoute = () => (
    <HScrollView index={0}>
      <CoacheeStatus activeCoachees={true} />
    </HScrollView>
  );

  const evaluation360Route = () => (
    <HScrollView index={1}>
      <CoacheeStatus activeCoachees={false} />
    </HScrollView>
  );

  const renderScene = SceneMap({
    autoevaluation: autoevaluationRoute,
    evaluation360: evaluation360Route,
  });

  return (
    <SafeAreaView style={{flex: 1}} edges={['right', 'left']}>
      <Tabs
        renderScene={renderScene}
        routes={routes}
        scrollEnabled={true}
        heightFull={true}
        center={true}
      />
    </SafeAreaView>
  );
}
