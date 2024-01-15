import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import HomeButton from '../HomeButton/HomeButton';
import tw from 'twrnc';
import auth from '@react-native-firebase/auth';
import { useTranslation } from 'react-i18next';

export default function CoacheeButtons({ navigation }) {
  const { t } = useTranslation('global');
  const logout = async () => {
    try {
      await auth().signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.log(error);
    }
  };

  const goTo = (to) => {
    navigation.navigate(to);
  };

  return (
    <>
      <HomeButton onPress={() => goTo('MyCoach')}>
        <Text style={tw.style('text-[#60636A]')}>Coach</Text>
      </HomeButton>
      <HomeButton onPress={() => goTo('AgendarCoachee')}>
        <Text style={tw.style('text-[#60636A]')}>
          {t('pages.home.components.buttons.myCalendar')}
        </Text>
      </HomeButton>
      <HomeButton onPress={() => goTo('MySessions')}>
        <Text style={tw.style('text-[#60636A]')}>
          {t('pages.home.components.buttons.mySessions')}
        </Text>
      </HomeButton>
      <HomeButton onPress={() => goTo('MyAssignations')}>
        <Text style={tw.style('text-center text-[#60636A]')}>
          {t('pages.home.components.buttons.myAssignations')}
        </Text>
      </HomeButton>
    </>
  );
}
