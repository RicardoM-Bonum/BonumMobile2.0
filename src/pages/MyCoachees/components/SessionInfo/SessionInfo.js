import {View, Text, Image, TouchableOpacity} from 'react-native';
import React, {useContext, useEffect} from 'react';
import tw from 'twrnc';
import MenuTab from './MenuTab/MenuTab';
import SessionInfoContext from './context/SessionInfoContext';
import {SafeAreaView} from 'react-native-safe-area-context';
import SessionInfoHeader from '../SessionInfoHeader';
import SessionInfoContextWrapper from './context/SessionInfoContextWrapper';

export default function SessionInfo({navigation, route}) {
  const coachee = route.params.session.coachee;
  const {setSelectedSession} = useContext(SessionInfoContext);
  const session = route.params.session;
  const backScreen = () => {
    navigation.navigate('CoacheeResume', {coachee});
  };

  useEffect(() => {
    setSelectedSession(session);
  }, [route.params]);

  return (
    <SafeAreaView style={{flex: 1, height: '100%', paddingHorizontal: 10}}>
      <MenuTab
        header={<SessionInfoHeader session={session} coachee={coachee} />}
        session={session}
      />
    </SafeAreaView>
  );
}
