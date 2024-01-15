import React, { useEffect } from 'react';
import { dateToLongDate } from '../../../../utilities/formatDate.utility';
import { useSelector } from 'react-redux';
import useScheduleContext from '../../hooks/useScheduleContext';
import { useTranslation } from 'react-i18next';
import { Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import tw from 'twrnc';
import BonumIcon from '../../../../assets/icons/Bonum_icon.png';
import { PrimaryButton } from '../../../../components/Buttons';
import { useUserUtilities } from '../../../../hooks';

function Scheduled({ navigation, setScheduled }) {
  const { date, hour } = useScheduleContext();
  const user = useSelector((state) => state.user);
  const { name, lastname } = user;
  const { t } = useTranslation('global');
  const { refreshUser } = useUserUtilities();

  const backScreen = async () => {
    setScheduled(false);
    await refreshUser();
    navigation.navigate('Dashboard');
  };

  return (
    <ScrollView>
      <View
        style={tw.style(
          'flex justify-center items-center h-full bg-[#E4EFF8e8] px-8 py-8'
        )}
      >
        <View style={tw.style('bg-white rounded-2xl shadow-md px-6 py-6')}>
          <Image
            style={tw.style('self-center w-25 h-25 mb-6')}
            source={BonumIcon}
          />
          <Text
            style={tw.style('text-black text-center text-lg font-bold mb-4')}
          >
            {t('pages.reschedule.components.scheduled.name', {
              name: name,
              lastname: lastname
            })}
          </Text>
          <Text style={tw.style('text-[#7F7C82] text-center text-base')}>
            {t('pages.reschedule.components.scheduled.subtitle')}
          </Text>
          <Text
            style={tw.style('text-black text-center text-lg font-bold my-2')}
          >
            {dateToLongDate(date)}
          </Text>
          <Text style={tw.style('text-[#299eff] text-center text-base mb-2')}>
            {hour.time}
          </Text>
          <View>
            <Text style={tw.style('text-[#7F7C82] text-center text-base')}>
              {t('pages.reschedule.components.scheduled.remember')}
            </Text>

            <Text style={tw.style('text-[#7F7C82] text-center text-base')}>
              {t('pages.reschedule.components.scheduled.remember2')}
            </Text>

            <Text style={tw.style('text-black text-center text-lg mt-4 mb-6')}>
              {t('pages.reschedule.components.scheduled.rememberBold')}
            </Text>
            <PrimaryButton title="Aceptar" onPress={backScreen} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default Scheduled;
