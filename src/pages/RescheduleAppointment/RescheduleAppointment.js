import {useFetchAndLoad, useCoachCalendar} from '../../hooks';
import {find} from 'lodash';
import {DateTime} from 'luxon';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {Text, View, ScrollView} from 'react-native';
import tw from 'twrnc';
import {getUserWorkingHours} from '../../services/calendar.service';
import {
  rescheduleSession,
  resetSessionNumber,
} from '../../services/sessions.service';
import displayToast from '../../utilities/toast.utility';
import Advice from './components/Advice';
import AvailableSchedule from './components/AvailableSchedule';
import Scheduled from './components/Scheduled';
import useScheduleContext from './hooks/useScheduleContext';
import {useTranslation} from 'react-i18next';
import RescheduleCalendar from './components/Calendar/RescheduleCalendar';
import {mongoDateToLongDate} from '../../utilities';
import NoData from '../../components/NoData/NoData';
import {SecondaryButton} from '../../components/Buttons';

function RescheduleAppointment({navigation, route}) {
  const user = useSelector(state => state.user);
  const {coach, sessions, timezone} = user;
  const {date, hour, setDate} = useScheduleContext();
  const [scheduled, setScheduled] = useState(false);

  const [loadingReset, setLoadingReset] = useState(false);
  const [scrollView, setScrollView] = useState(null);
  const [sessionToReschedule, setSessionToReschedule] = useState(false);

  const {getCoachCalendar, isNotWorkingDay} = useCoachCalendar(coach?._id);
  const {loading, callEndpoint} = useFetchAndLoad();
  const [minDate, setMinDate] = useState(new Date());
  const {t} = useTranslation('global');
  const [schedules, setSchedules] = useState();
  const sessionId = route.params.session._id;

  const getMyCoachCalendar = async () => {
    try {
      await getCoachCalendar();
    } catch (error) {
      console.log(error);
    }
  };

  const getWorkingHours = async () => {
    try {
      const {data} = await callEndpoint(getUserWorkingHours(user?.coach?._id));
      setSchedules(data.data);
    } catch (error) {
      console.log('Working Hours Error');
      console.log(error);
    }
  };

  const getSessionToReschedule = async () => {
    setSessionToReschedule(
      find(sessions, session => session._id === sessionId),
    );
  };

  const getMinDate = () => {
    const today = DateTime.now().toFormat('yyyy-MM-dd');

    if (!sessionToReschedule) {
      setMinDate(today);
      return;
    }

    const sessionToRescheduleDate = DateTime.fromISO(
      sessionToReschedule.date,
    ).toFormat('yyyy-MM-dd');

    if (sessionToRescheduleDate < today) {
      setMinDate(today);
      return;
    }

    setMinDate(sessionToRescheduleDate);

    // DateTime.now().toJSDate()
  };

  useEffect(() => {
    if (!coach) {
      navigation.navigate('Dashboard');
    }
    getMyCoachCalendar();
  }, [coach]);

  useEffect(() => {
    getMinDate();
    getWorkingHours();
  }, [sessionToReschedule]);

  useEffect(() => {
    getSessionToReschedule(sessionId);
  }, [sessionId]);

  if (!coach) {
    return true;
  }

  const getHoursDifference = dateWithTimezone => {
    const currentDate = new Date();
    const sessionDateISO = new Date(dateWithTimezone).toISOString();
    const sessionDate = new Date(sessionDateISO);
    const hoursDifference =
      (sessionDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60);

    let currentHours = Math.round(hoursDifference);
    return currentHours;
  };

  const updateCoachingSession = async () => {
    try {
      const dateWithTimezone = DateTime.fromMillis(hour.startHour.ts, {
        zone: timezone,
      }).toISO();

      let hours = getHoursDifference(dateWithTimezone);

      if (hours <= 24) {
        displayToast(`${t('pages.reschedule.timeLimit')}`, 'error');
        return;
      }

      const event = {
        title: t('pages.reschedule.eventTitle', {
          name: user.name,
          lastname: user.lastname,
        }),
        calendarId: user?.coach?.calendar?.id,
        status: 'confirmed',
        busy: true,
        read_only: true,
        description: t('pages.reschedule.description'),
        when: {
          object: 'timespan',
          start_time: hour.startHour.ts / 1000,
          end_time: hour.startHour.ts / 1000 + 3600,
          start_timezone: user.coach.timezone,
          end_timezone: user.coach.timezone,
        },
      };

      await callEndpoint(
        rescheduleSession({
          date: dateWithTimezone,
          id: sessionId,
          canceled: false,
          noShow: false,
          status: false,
          event,
        }),
      );

      await callEndpoint(
        resetSessionNumber({
          id: sessionId,
        }),
      );

      setScheduled(true);
    } catch (error) {
      console.log(error);
      displayToast('Error', 'error');
    }
  };

  const errorDate = t('pages.reschedule.errorDate');
  const errorHour = t('pages.reschedule.errorHour');

  useEffect(() => {
    if (date) {
      scrollView?.scrollToEnd({animated: true});
    }
  }, [date]);

  const handleSchedule = async () => {
    if (!date) {
      displayToast(errorDate, 'error');
      return; // Mostrar un error
    }
    if (!hour) {
      displayToast(errorHour, 'error');
      return; // Mostrar error
    }
    // Registrar en backend
    await updateCoachingSession();
  };

  const tileDisabled = calendarDate => {
    if (isNotWorkingDay(calendarDate)) {
      return true;
    }
  };

  if (scheduled) {
    return (
      <View>
        <Scheduled navigation={navigation} setScheduled={setScheduled} />
      </View>
    );
  }

  if (sessionToReschedule && sessionToReschedule?.noShow) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          paddingHorizontal: 30,
          marginBottom: 50,
        }}>
        <NoData title={t('pages.reschedule.noShow')} />
        <SecondaryButton
          title={t('pages.reschedule.goBack')}
          onPress={() => navigation.navigate('MySessions')}
          loading={loading}
        />
      </View>
    );
  }

  return (
    <ScrollView
      ref={view => {
        setScrollView(view);
      }}>
      <View style={tw.style('flex justify-center bg-[#E4EFF8e8] px-8 py-8')}>
        <Text style={tw.style('text-black mt-6 text-base font-bold mb-4')}>
          Estás reagendando la sesión del{' '}
          {mongoDateToLongDate(sessionToReschedule.date)}
        </Text>
        <Advice />
        <View style={tw.style('mb-2 mt--4')}>
          <RescheduleCalendar
            value={date}
            minDate={minDate.toString()}
            onDayPress={setDate}
            schedules={schedules}
            tileDisabled={({date: calendarDate}) => tileDisabled(calendarDate)}
            sessionToReschedule={sessionToReschedule}
          />
        </View>

        <AvailableSchedule
          handleSchedule={handleSchedule}
          isLoadingSchedule={loading}
          isDisableSchedule={loading}
          scrollView={scrollView}
          setLoadingReset={setLoadingReset}
          loadingReset={loadingReset}
          navigation={navigation}
        />
      </View>
    </ScrollView>
  );
}

export default RescheduleAppointment;
