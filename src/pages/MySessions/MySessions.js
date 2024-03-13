import React, {useEffect} from 'react';
import CoachInfo from './components/CoachInfo';
import NoData from '../../components/NoData/NoData';
import {useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useUserUtilities} from '../../hooks';
import SessionsTabs from './components/SessionsTabs';

export default function MySessions({navigation}) {
  const {sessions} = useSelector(state => state.user);
  const {refreshSessions} = useUserUtilities();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refreshSessions();
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {}, [sessions]);

  return (
    <SafeAreaView
      style={{flex: 1, paddingHorizontal: 22}}
      edges={['left', 'right']}>
      {sessions?.length > 0 ? (
        <SessionsTabs
          header={<CoachInfo withSessions />}
          sessions={sessions}
          navigation={navigation}
        />
      ) : (
        <>
          <CoachInfo />
          <NoData title={'No tiene sesiones'} />
        </>
      )}
    </SafeAreaView>
  );
}
