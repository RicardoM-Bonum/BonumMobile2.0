import { Image, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect } from 'react';
import tw from 'twrnc';
import MenuTab from '../MenuTab';
import MySessionsContext from './context/SessionsContext';
import { useFetchAndLoad } from '../../../../hooks';
import { getSessionByID } from '../../../../services/sessions.service';
import { SafeAreaView } from 'react-native-safe-area-context';
import SessionHeader from '../SessionHeader';

export default function Session({ navigation, route }) {
  const { setSelectedSession } = useContext(MySessionsContext);
  const { callEndpoint } = useFetchAndLoad();

  const session = route.params.session;

  const backScreen = () => {
    navigation.navigate('MySessions');
  };

  const getSession = async () => {
    try {
      const { data } = await callEndpoint(
        getSessionByID(route.params.session._id)
      );
      setSelectedSession(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSession();
    setSelectedSession(route.params.session);
  }, [route.params]);

  return (
    <SafeAreaView
      style={tw.style('bg-[#E4EFF8e8] px-6 py-8 min-h-full')}
      edges={['left', 'right']}
    >
      <MenuTab header={<SessionHeader session={session} />} />
    </SafeAreaView>
  );
}
