import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import HomeButton from '../HomeButton/HomeButton';
import tw from 'twrnc';
import auth from '@react-native-firebase/auth';
import {useTranslation} from 'react-i18next';

export default function CoachButtons({navigation}) {
  const {t} = useTranslation('global');

  const logout = async () => {
    try {
      await auth().signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <HomeButton onPress={() => navigation.navigate('MyCoachees')}>
        <Text style={tw.style('text-[#60636A]')}>
          {t('pages.home.components.buttons.myCoachees')}
        </Text>
      </HomeButton>
      <HomeButton onPress={() => navigation.navigate('CoachCalendar')}>
        <Text style={tw.style('text-[#60636A]')}>
          {t('pages.home.components.buttons.myCalendar')}
        </Text>
      </HomeButton>
      <HomeButton onPress={() => navigation.navigate('MyEvaluationsDashboard')}>
        <Text style={tw.style('text-[#60636A]')}>
          {t('pages.home.components.buttons.myEvaluations')}
        </Text>
      </HomeButton>
      <HomeButton
        onPress={() => navigation.navigate('Resources')}
        style={tw.style('text-[#60636A]')}>
        <Text style={tw.style('text-center text-[#60636A]')}>
          {t('pages.home.components.buttons.myCourses')}
        </Text>
      </HomeButton>
    </>
  );
}
