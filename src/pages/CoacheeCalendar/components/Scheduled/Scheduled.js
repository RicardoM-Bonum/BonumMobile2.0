import React, { useEffect } from 'react';
import { dateToLongDate } from '../../../../utilities/formatDate.utility';
import { useSelector } from 'react-redux';
import useCoacheeCalendarContext from '../../hooks/useCoacheeCalendarContext';
import { useUserUtilities } from '../../../../hooks';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

function Scheduled() {
  const { date, hour } = useCoacheeCalendarContext();
  const user = useSelector((state) => state.user);
  const { name, lastname } = user;
  const { refreshSessions } = useUserUtilities(user);
  const { t } = useTranslation('global');

  useEffect(() => {
    refreshSessions();
  }, []);

  return (
    <View className="Scheduled Card">
      <Text className="Scheduled__name">
        {t('pages.reschedule.components.scheduled.name', {
          name: name,
          lastname: lastname
        })}
      </Text>
      <Text className="Scheduled__subtitle">
        {t('pages.reschedule.components.scheduled.subtitle')}
      </Text>
      <Text className="Scheduled__date">{dateToLongDate(date)}</Text>
      <Text className="Scheduled__hour">{hour.time}</Text>
      <View className="Scheduled__remember">
        <Text className="Scheduled__remember_advice">
          {t('pages.reschedule.components.scheduled.remember')}
        </Text>

        <Text className="Scheduled__remember_advice">
          {t('pages.reschedule.components.scheduled.remember2')}
        </Text>

        <Text className="Scheduled__remember_advice_bold">
          {t('pages.reschedule.components.scheduled.rememberBold')}
        </Text>
      </View>
    </View>
  );
}

export default Scheduled;
