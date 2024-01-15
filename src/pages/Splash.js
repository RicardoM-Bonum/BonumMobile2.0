import React, { useEffect } from 'react';
import { Image, View } from 'react-native';
import tw from 'twrnc';
import { useSelector } from 'react-redux';
import 'react-native-gesture-handler';

export default function Splash({ navigation }) {
  const user = useSelector((state) => state.user);

  const goToScreen = (routeName) => {
    navigation.navigate(routeName);
  };

  useEffect(() => {
    setTimeout(() => {
      if (user && user.uid && user.uid.length > 0) {
        if (!user.onboardingCompleted) {
          goToScreen('Onboarding');
        } else {
          goToScreen('Dashboard');
        }
      } else {
        goToScreen('Login');
      }
    }, 3000);
  }, [user.onboardingCompleted]);

  useEffect(() => {
    setTimeout(() => {
      if (user && user.uid && user.uid.length > 0) {
        if (!user.onboardingCompleted) {
          navigation.navigate('Onboarding');
        } else {
          goToScreen('Dashboard');
        }
      } else {
        goToScreen('Login');
      }
    }, 3000);
  }, []);

  return (
    <View style={tw.style('flex h-full justify-center items-center bg-white')}>
      <Image source={require('../assets/img/logo.png')} />
    </View>
  );
}
