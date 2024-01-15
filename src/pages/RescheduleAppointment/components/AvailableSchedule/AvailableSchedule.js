import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useFetchAndLoad } from '../../../../hooks';
import { getCoachAvailability } from '../../../../services/calendar.service';
import { Text, View, StyleSheet } from 'react-native';
import tw from 'twrnc';
import Loading from '../../../../components/Loading';
import { compact, map } from 'lodash';
import { DateTime } from 'luxon';
import useScheduleContext from '../../hooks/useScheduleContext';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from '../../../../components/Buttons';
import { Button } from '@rneui/base';
import displayToast from '../../../../utilities/toast.utility';

function AvailableSchedule({
  handleSchedule,
  isLoadingSchedule,
  scrollView,
  navigation
}) {
  const { loading, callEndpoint } = useFetchAndLoad();

  const [loadingReset, setLoadingReset] = useState(false);

  const [schedule, setSchedule] = useState([]);
  const { coach, timezone } = useSelector((state) => state.user);
  const { setHour, hour, date } = useScheduleContext();
  const { t } = useTranslation('global');

  const getHours = (workHours) => {
    const hours = map(workHours, (unformattedHour, index) => {
      const start = DateTime.fromISO(unformattedHour).setZone(timezone);
      const today = DateTime.now().setZone(timezone);
      if (start < today) return false;
      const finish = start.plus({ hours: 1 });
      return {
        id: index,
        time: `${start.toFormat('hh:mma')} - ${finish.toFormat('hh:mma')}`,
        startHour: start
      };
    });
    return compact(hours);
  };

  const errorCoach = t(
    'pages.reschedule.components.availableSchedule.errorCoach'
  );

  const coachAvailability = async () => {
    try {
      const response = await callEndpoint(
        getCoachAvailability(date, coach._id)
      );
      const workHours = response.data.data;
      const hours = getHours(workHours);
      setSchedule(hours);
      scrollView?.scrollToEnd({ animated: true });
    } catch (error) {
      displayToast(`Error agendando la sesión:${error.message}`);
      navigation.navigate('Home');
    }
  };

  useEffect(() => {
    if (date) coachAvailability();
  }, [date]);

  if (loading || isLoadingSchedule || loadingReset)
    return (
      <Loading
        isFull={false}
        title={t('pages.reschedule.components.availableSchedule.loading')}
      />
    );

  return (
    <View style={tw.style('flex-row flex-wrap justify-center')}>
      {schedule && Array.isArray(schedule) && schedule.length > 1 ? (
        <View style={styles.wrapper}>
          <View style={styles.buttonsContainer}>
            {schedule.map((scheduleObj) => (
              <Button
                key={scheduleObj.id}
                onPress={() => setHour(scheduleObj)}
                title={scheduleObj.time}
                containerStyle={styles.buttonContainer}
                buttonStyle={
                  hour?.time == scheduleObj.time
                    ? { ...styles.button, ...styles.selectedStyle }
                    : styles.button
                }
                titleStyle={styles.buttonTitle}
              />
            ))}
          </View>
          <PrimaryButton
            title="Agendar Sesión"
            onPress={handleSchedule}
            style={{ marginTop: 10 }}
          />
        </View>
      ) : (
        <View style={tw.style('flex-column w-full')}>
          <Text
            style={tw.style(
              'text-black mt-6 text-center text-base font-bold mb-6'
            )}
          >
            {t('pages.reschedule.noSchedule')}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#FFFFFF'
  },
  buttonTitle: {
    color: '#707070',
    fontSize: 12
  },

  buttonContainer: {
    padding: 5,
    width: '50%',
    marginTop: 25
  },

  buttonsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap'
  },

  selectedStyle: {
    borderColor: '#2196F3'
  },

  wrapper: {
    flex: 1,
    paddingHorizontal: 10
  }
});

export default AvailableSchedule;
