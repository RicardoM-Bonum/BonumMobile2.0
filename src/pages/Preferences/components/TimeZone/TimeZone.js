import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import tw from 'twrnc';
import { timezonesToReactSelect } from '../../../../utilities/timezones.utility';
import { SelectList } from 'react-native-dropdown-select-list';
import { useTranslation } from 'react-i18next';
import { findIndex } from 'lodash';
import displayToast from '../../../../utilities/toast.utility';
import { PrimaryButton } from '../../../../components/Buttons';
import { useSelector } from 'react-redux';
import { useFetchAndLoad, useUserUtilities } from '../../../../hooks';
import { updateCoach } from '../../../../services/coach.service';
import { updateCoachee } from '../../../../services/coachee.service';

export default function TimeZone({ navigation }) {
  const user = useSelector((state) => state.user);
  const [timezones] = useState(timezonesToReactSelect);
  const [selected, setSelected] = useState(null);
  const [isShowButton, setIsShowButton] = useState(false);
  const { callEndpoint, loading } = useFetchAndLoad();
  const { refreshUser } = useUserUtilities();
  // const [openMap, setOpenMap] = useState(false)
  const { t } = useTranslation('global');
  const isCoach = user.role === 'coach' ? true : false;

  const auto = t('pages.onboarding.components.pickTimezone.messages.auto');

  const handleSubmit = async () => {
    // dispatch(setTimezone(selected.key));
    // nextStep();
    try {
      const userUpdated = {
        timezone: selected.key,
        id: user.mongoID
      };
      if (isCoach) await callEndpoint(updateCoach(userUpdated));
      else await callEndpoint(updateCoachee(userUpdated));
      await refreshUser();
      displayToast('Se ha cambiado correctamente', 'success');
      navigation.navigate('ChangeTimeZone');
    } catch (error) {
      console.log(error);
      displayToast('Ah ocurrido un error', 'error');
    }
  };

  const getIndexOfTimezone = (timezone) => {
    const findByValue = findIndex(timezones, {
      value: timezone
    });

    const findByKey = findIndex(timezones, {
      key: timezone
    });

    if (findByValue >= 0) return findByValue;
    return findByKey;
  };

  const setTimeZoneFromBrowser = () => {
    const index = getIndexOfTimezone(
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );
    if (index >= 0) {
      displayToast(auto, 'success');
      setSelected(timezones[index]);
    }
  };

  const handleSelectChange = (timezone) => {
    setIsShowButton(true);
    const index = getIndexOfTimezone(timezone);
    setSelected(timezones[index]);
  };

  useEffect(() => {
    if (user.timezone) {
      console.log(user.timezone);
      const index = getIndexOfTimezone(user.timezone);
      setSelected(timezones[index]);
    } else if (timezones) setTimeZoneFromBrowser();
  }, [timezones]);

  return (
    <View style={tw.style('bg-[#E4EFF8e8] px-8 py-8')}>
      <View style={tw.style('justify-center')}>
        <Text style={tw.style('text-black text-center text-xl font-bold')}>
          {t('pages.onboarding.components.pickTimezone.title')}
        </Text>
        <Text style={tw.style('text-[#707070] text-center text-sm mt-5')}>
          {t('pages.onboarding.components.pickTimezone.subtitle')}
        </Text>
        <View style={tw.style('mt-4')}>
          <View
            style={tw.style(
              'bg-white shadow-md rounded-3xl justify-between  w-full my-4 mx-auto px-4 py-6'
            )}
          >
            <SelectList
              setSelected={handleSelectChange}
              data={timezones}
              defaultOption={selected}
              save="value"
              placeholder="Selecciona tu zona horaria"
              searchPlaceholder="Buscar horario"
              inputStyles={tw.style('text-black')}
              dropdownTextStyles={tw.style('text-black')}
            />
          </View>
        </View>
        {isShowButton && (
          <PrimaryButton
            title={t('pages.onboarding.components.pickTimezone.saveButton')}
            onPress={handleSubmit}
            style={tw.style('mt-5')}
            loading={loading}
          />
        )}
      </View>
    </View>
  );
}
