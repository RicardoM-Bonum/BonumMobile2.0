import { View, ScrollView } from 'react-native';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import tw from 'twrnc';
import { useCheckForCalendar, useCheckUpdate } from '../../hooks';

import NextSession from './components/NextSession';
import CoachButtons from './components/CoachButtons';
import CoacheeButtons from './components/CoacheeButtons';
import Welcome from './components/Welcome';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeNew({ navigation }) {
  const user = useSelector((state) => state.user);
  const { checkForCalendar } = useCheckForCalendar(user, navigation);
  const { checkVersionUpdate } = useCheckUpdate();

  const checkForVerifications = () => {
    if (
      user &&
      user.uid &&
      user.uid.length > 0 &&
      user.onboardingCompleted === false
    ) {
      navigation.navigate('Onboarding');
      return;
    }

    if (
      user?.onboardingCompleted &&
      (!user?.languages || user?.languages?.length < 1)
    ) {
      console.log('navigating to languages');
      console.log(user.languages);
      navigation.navigate('UpdateLanguages');
      return;
    }

    checkForCalendar();
  };

  useFocusEffect(
    React.useCallback(() => {
      checkForVerifications();
    }, [user.onboardingCompleted, user])
  );

  useEffect(() => {
    checkVersionUpdate();
  }, []);

  return (
    <ScrollView>
      <Welcome />
      <View style={tw.style('px-6 bg-[#E4EFF8e8] min-h-[525px] h-full')}>
        <NextSession user={user} navigation={navigation} />
        <View style={tw.style('flex-row flex-wrap justify-between')}>
          {user.role === 'coach' ? (
            <CoachButtons navigation={navigation} />
          ) : (
            <CoacheeButtons navigation={navigation} />
          )}
        </View>
      </View>
    </ScrollView>
  );
}
