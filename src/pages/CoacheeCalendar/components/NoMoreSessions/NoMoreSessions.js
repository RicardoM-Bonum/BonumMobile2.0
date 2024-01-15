import React from 'react';
import { useSelector } from 'react-redux';
import BonumIcon from '../../../../assets/icons/Bonum_icon.png';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import tw from 'twrnc';

function NoMoreSessions({ navigation }) {
  const { name, lastname } = useSelector((state) => state.user);
  const { t } = useTranslation('global');

  return (
    <View
      style={tw.style('flex h-full justify-center bg-[#E4EFF8e8] px-8 py-8')}
    >
      <Image source={BonumIcon} />
      <Text style={tw.style('text-black text-center text-xl font-bold')}>
        {t('pages.reschedule.components.noMoreSessions.title')}{' '}
        <Text>
          {name} {lastname}
        </Text>
        {t('pages.reschedule.components.noMoreSessions.description')}
      </Text>
      <TouchableOpacity
        style={tw.style('bg-[#299EFF] px-4 py-3 rounded-full shadow-md mt-6')}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <Text style={tw.style('text-white text-center text-lg')}>
          {t('pages.reschedule.components.noMoreSessions.button')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default NoMoreSessions;
