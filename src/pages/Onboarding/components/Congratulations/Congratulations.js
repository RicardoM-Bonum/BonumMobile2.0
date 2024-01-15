import { View, Text, Image } from 'react-native';
import React, { useEffect } from 'react';
import tw from 'twrnc';
import { TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useUserUtilities } from '../../../../hooks';

export default function Congratulations({ navigation }) {
  const { coach } = useSelector((state) => state.user);
  const { refreshUser } = useUserUtilities();

  useEffect(() => {
    return () => {
      refreshUser();
    };
  }, []);

  return (
    <View
      style={tw.style(
        'bg-[#E4EFF8e8]  justify-center rounded-2xl py-8 px-6 h-full items-center'
      )}
    >
      <Image
        source={require('../../../../assets/img/icons/thumbs-up.png')}
        style={tw.style('self-center w-25 h-25')}
      />
      <Text style={tw.style('text-center')}>
        Has tomado una gran decisión{' '}
        <Text style={tw.style('font-bold')}>
          {coach?.name} {coach?.lastname}
        </Text>{' '}
        es tu nuevo coach, será quien te acompañe en este gran camino y te ayude
        a lograr tus objetivos...{' '}
      </Text>
      <TouchableOpacity
        onPress={() => {
          refreshUser();
          navigation.navigate('AgendarCoachee');
        }}
        style={tw.style('bg-[#299EFC] py-4 px-8 rounded-full mt-6')}
      >
        <Text style={tw.style('text-white text-center')}>
          Agendar Primera Sesión
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          refreshUser();
          navigation.navigate('Dashboard');
          navigation.navigate('HomeNavigation');
        }}
        style={tw.style('bg-[#299EEE] py-4 px-8 rounded-full mt-6')}
      >
        <Text style={tw.style('text-white text-center')}>Agendar después</Text>
      </TouchableOpacity>
    </View>
  );
}
