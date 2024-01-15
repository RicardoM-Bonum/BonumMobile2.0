import { useFetchAndLoad, useCoachCalendar, useForceUpdate } from '../../hooks';
import { forEach, last } from 'lodash';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Text, View, ScrollView } from 'react-native';
import tw from 'twrnc';
import { getUserWorkingHours } from '../../services/calendar.service';
import {
  createSession,
  getCoacheeSessions,
  getCoachSessions
} from '../../services/sessions.service';
import displayToast from '../../utilities/toast.utility';
import Advice from './components/Advice';
import Scheduled from './components/Scheduled';
import useScheduleContext from './hooks/useScheduleContext';
import { useTranslation } from 'react-i18next';
import CalendarGeneric from '../../components/Calendar/CalendarGeneric';
import Sessions from './components/Sessions';
import AvailableSchedule from './components/AvailableSchedule';
import Loading from '../../components/Loading';

function ScheduleAppointment({ navigation }) {
  const { coach, sessions, timezone, name, lastname, role, mongoID } =
    useSelector((state) => state.user);
  const { date, hour, setDate } = useScheduleContext();
  const forceUpdate = useForceUpdate();
  const [scheduled, setScheduled] = useState(false);
  const [scrollView, setScrollView] = useState(null);
  const [minDate, setMinDate] = useState(new Date().toString());
  const [sessionsToDisplay, setSessionsToDisplay] = useState([]);

  const { getCoachCalendar, isNotWorkingDay } = useCoachCalendar(coach?._id);
  const { loading, callEndpoint } = useFetchAndLoad();
  let lastSession = last(sessions);
  const { t } = useTranslation('global');
  const [schedules, setSchedules] = useState();

  const getMyCoachCalendar = async () => {
    try {
      await getCoachCalendar();
    } catch (error) {
      console.log(error);
    }
  };

  const getWorkingHours = async () => {
    try {
      const { data } = await callEndpoint(getUserWorkingHours(coach?._id));
      setSchedules(data.data);
    } catch (error) {
      console.log('Working Hours Error');
      console.log(error);
    }
  };

  const getMinDate = () => {
    try {
      if (!lastSession) {
        setMinDate(DateTime.now().toJSDate());
        return;
      }
      const newMinDate = DateTime.fromISO(lastSession.date)
        .plus({ days: 11 })
        .toJSDate();

      const today = DateTime.now().toJSDate();

      if (newMinDate < today) {
        setMinDate(today.toString());
      } else {
        setMinDate(newMinDate.toString());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getSessionsToDisplay = () => {
    const sessionsTemp = [];

    forEach(sessions, (session) => {
      const selectedDate = DateTime.fromJSDate(date, {
        zone: 'utc'
      }).toISODate();

      const sessionDate = DateTime.fromISO(session?.date).toISODate();

      if (sessionDate === selectedDate) {
        sessionsTemp.push(session);
      }
    });

    setSessionsToDisplay(sessionsTemp);
  };

  useEffect(() => {
    if (!coach) {
      navigation.navigate('Dashboard');
      // displayToast('No tienes coach.');
    }
    getMyCoachCalendar();
  }, [coach]);

  const refreshSessions = async () => {
    try {
      let result = null;
      if (role === 'coach') {
        result = await callEndpoint(getCoachSessions(mongoID));
      } else {
        result = await callEndpoint(getCoacheeSessions(mongoID));
      }
      if (result) {
        lastSession = last(result?.data?.data);
        getMinDate();
        getWorkingHours();
        forceUpdate();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // getMinDate();
    getWorkingHours();

    const unsuscribe = navigation.addListener('focus', async () => {
      setDate(null);
      await refreshSessions();
    });
    return () => {
      unsuscribe();
    };
  }, []);

  const createCoachingSession = async () => {
    try {
      const dateWithTimezone = DateTime.fromMillis(hour.startHour.ts, {
        zone: timezone
      }).toISO();

      const event = {
        title: t('pages.reschedule.eventTitle', {
          name: name,
          lastname: lastname
        }),
        calendarId: coach?.calendar?.id,
        status: 'confirmed',
        busy: true,
        read_only: true,
        description: t('pages.reschedule.description'),
        when: {
          object: 'timespan',
          start_time: hour.startHour.ts / 1000,
          end_time: hour.startHour.ts / 1000 + 3600,
          start_timezone: coach.timezone,
          end_timezone: coach.timezone
        }
      };

      await callEndpoint(
        createSession({
          coach: coach._id,
          coachee: mongoID,
          date: dateWithTimezone,
          event
        })
      );

      setScheduled(true);
    } catch (error) {
      console.log(error?.response?.data?.message);
      displayToast(
        error?.response?.data?.message
          ? error?.response?.data?.message
          : 'Error',
        'error'
      );
    }
  };

  const errorDate = t('pages.reschedule.errorDate');
  const errorHour = t('pages.reschedule.errorHour');

  useEffect(() => {
    if (date) {
      scrollView?.scrollToEnd({ animated: true });
      getSessionsToDisplay();
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
    await createCoachingSession();
  };

  if (!coach) return true;

  if (scheduled) {
    return (
      <View>
        <Scheduled navigation={navigation} setScheduled={setScheduled} />
      </View>
    );
  }

  if (loading) return <Loading isFull />;

  return (
    <ScrollView
      ref={(view) => {
        setScrollView(view);
      }}
    >
      <View style={tw.style('flex justify-center bg-[#E4EFF8e8] px-8 py-8')}>
        <Text style={tw.style('text-black mt-6 text-base font-bold mb-4')}>
          {t('pages.reschedule.title')}{' '}
          <Text>
            {coach?.name} {coach?.lastname}
          </Text>
        </Text>
        <Advice />
        <View style={tw.style('mb-2 mt--4')}>
          <CalendarGeneric
            value={date}
            navigation={navigation}
            minDate={minDate}
            onDayPress={setDate}
            schedules={schedules}
          />
        </View>

        {sessionsToDisplay?.length < 1 && date && (
          <AvailableSchedule
            handleSchedule={handleSchedule}
            scrollView={scrollView}
          />
        )}

        {sessionsToDisplay?.length > 0 && date && (
          <Sessions date={date} sessionsToDisplay={sessionsToDisplay} />
        )}
      </View>
    </ScrollView>
  );
}

export default ScheduleAppointment;
