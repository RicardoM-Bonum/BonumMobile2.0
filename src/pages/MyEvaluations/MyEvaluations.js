import * as React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {SceneMap} from 'react-native-tab-view';
import {Text} from 'native-base';
import tw from 'twrnc';
import Tabs from '../../components/Tabs';
import Evaluation from '../../components/Evaluation';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import {HScrollView} from 'react-native-head-tab-view';
import Comments from '../MyCoachees/components/CoacheeResume/MenuTab/screens/Comments';

export default function MyEvaluations({navigation}) {
  const {mongoID} = useSelector(state => state.user);
  const {t} = useTranslation('global');
  const routes = [
    {
      key: 'autoevaluation',
      title: t('pages.myEvaluations.tabAutoevaluation'),
    },
    {key: 'evaluation360', title: t('pages.myEvaluations.tab360')},
    {
      key: 'initialComments',
      title: `${t('pages.myEvaluations.tabInitialComments')}`,
    },
    {
      key: 'finalComments',
      title: `${t('pages.myEvaluations.tabFinalComments')}`,
    },
  ];

  console.log('TABS24');

  const autoevaluationRoute = () => (
    <HScrollView index={0}>
      <Evaluation
        type="autoevaluation"
        coachee={mongoID}
        title={t('pages.myEvaluations.tabAutoevaluation')}
      />
    </HScrollView>
  );

  const evaluation360Route = () => (
    <HScrollView index={1}>
      <Evaluation
        type="evaluation360"
        coachee={mongoID}
        title={t('pages.myEvaluations.tab360')}
      />
    </HScrollView>
  );

  const initialCommentsRoute = () => (
    <HScrollView index={3}>
      <Comments
        type="initial"
        coachee={mongoID}
        title={t('pages.myEvaluations.tabInitialComments')}
      />
    </HScrollView>
  );

  const finalCommentsRoute = () => (
    <HScrollView index={4}>
      <Comments
        type="final"
        coachee={mongoID}
        title={t('pages.myEvaluations.tabFinalComments')}
      />
    </HScrollView>
  );

  const renderScene = SceneMap({
    autoevaluation: autoevaluationRoute,
    evaluation360: evaluation360Route,
    initialComments: initialCommentsRoute,
    finalComments: finalCommentsRoute,
  });

  // { key: 'third', title: t('pages.myEvaluations.tabComments') }

  const backScreen = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={{flex: 1, paddingHorizontal: 18}}
      edges={['right', 'left']}>
      <Tabs
        renderScene={renderScene}
        routes={routes}
        scrollEnabled={true}
        heightFull={true}
        // header={
        //   <View >
        //     <Text>Hola</Text>
        //   </View>
        // }
      />
    </SafeAreaView>
  );
}
