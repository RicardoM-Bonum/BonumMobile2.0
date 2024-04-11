import React, {useEffect} from 'react';
import {View} from 'react-native';
import tw from 'twrnc';
import Tabs from '../../components/Tabs';
import {useFetchAndLoad} from '../../hooks';
import Assignations from './components/Assignations';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {getUserAssignations} from '../../services/assignations.service';
import assignationsAdapted from '../../adapters/assignations.adapter';
import displayToast from '../../utilities/toast.utility';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Text} from 'native-base';
import {SceneMap} from 'react-native-tab-view';
import {HScrollView} from 'react-native-head-tab-view';

export default function MyAssignations({navigation}) {
  const {loading, callEndpoint} = useFetchAndLoad();
  const {mongoID} = useSelector(state => state.user);
  const [assignations, setAssignations] = React.useState([]);
  const {t} = useTranslation('global');

  const getError = t('pages.myAssignations.getError');

  const getMyAssignations = async () => {
    try {
      const {data} = await callEndpoint(getUserAssignations(mongoID));
      setAssignations(
        data.data.map(assignation => assignationsAdapted(assignation)),
      );
    } catch (error) {
      console.log(error);
      displayToast(getError, 'error');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getMyAssignations();
    });

    // return () => unsubscribe();
  }, [mongoID]);

  const pendingAssignmentsRoute = () => (
    <HScrollView index={0}>
      <Assignations
        assignations={assignations}
        setAssignations={setAssignations}
      />
    </HScrollView>
  );

  const completedAssignmentsRoute = () => (
    <HScrollView index={1}>
      <Assignations
        completed
        assignations={assignations}
        setAssignations={setAssignations}
      />
    </HScrollView>
  );

  const routes = [
    {
      key: 'pending',
      title: t('pages.mySessions.components.session.assignationsP'),
    },
    {
      key: 'completed',
      title: t('pages.mySessions.components.session.assignationsC'),
    },
  ];

  const renderScene = SceneMap({
    pending: pendingAssignmentsRoute,
    completed: completedAssignmentsRoute,
  });

  return (
    <Tabs
      renderScene={renderScene}
      routes={routes}
      scrollEnabled={true}
      heightFull={true}
      style={{
        marginHorizontal: 18,
      }}
      header={
        <>
          <Text />
        </>
      }
    />
  );
}
