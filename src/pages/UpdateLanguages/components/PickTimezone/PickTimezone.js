import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import tw from 'twrnc';
import { timezonesToReactSelect } from '../../../../utilities/timezones.utility';
import { SelectList } from 'react-native-dropdown-select-list';
import { useTranslation } from 'react-i18next';
import { findIndex } from 'lodash';
import displayToast from '../../../../utilities/toast.utility';

export default function PickTimezone({ values, setValues }) {
  const [timezones] = useState(timezonesToReactSelect);
  const [timezone, setTimezone] = useState(null);
  // const [openMap, setOpenMap] = useState(false)
  const { t } = useTranslation('global');

  const auto = t('pages.onboarding.components.pickTimezone.messages.auto');

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
      setValues({ ...values, timezone: timezones[index]?.key });
      setTimezone(timezones[index]);
    }
  };

  const handleSelectChange = (timezone) => {
    const index = getIndexOfTimezone(timezone);
    setValues({ ...values, timezone: timezones[index]?.key });
    setTimezone(timezones[index]);
  };

  useEffect(() => {
    if (timezones) setTimeZoneFromBrowser();
  }, [timezones]);

  return (
    <View style={tw.style('justify-center mt--6')}>
      <View style={tw.style('mt-4')}>
        <View
          style={tw.style(
            'bg-white shadow-md rounded-3xl justify-between  w-full my-4 mx-auto px-4 py-6'
          )}
        >
          <SelectList
            setSelected={handleSelectChange}
            data={timezones}
            defaultOption={timezone}
            save="value"
            placeholder="Selecciona tu zona horaria"
            searchPlaceholder="Buscar zona horaria"
            inputStyles={tw.style('text-black')}
            dropdownTextStyles={tw.style('text-black')}
          />
        </View>
      </View>
    </View>
  );
}
