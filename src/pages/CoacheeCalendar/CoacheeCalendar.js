import React, {useState, useEffect} from 'react';
import {Text, View, TouchableOpacity, ScrollView} from 'react-native';
import tw from 'twrnc';
import {Image} from 'react-native';
import {last} from 'lodash';
import {DateTime} from 'luxon';
import Calendar from '../../components/Calendar';
import AvailableSchedule from './components/AvailableSchedule';
import Advice from './components/Advice';
import {useSelector} from 'react-redux';
import useCoacheeCalendarContext from './hooks/useCoacheeCalendarContext';
import {useCoachCalendar, useFetchAndLoad} from '../../hooks';
import {useTranslation} from 'react-i18next';
import Scheduled from './components/Scheduled';
import {createEventOnCoachCalendar} from '../../services/calendar.service';
import {createSession} from '../../services/sessions.service';
import NoMoreSessions from './components/NoMoreSessions';
import 'react-native-gesture-handler';
import displayToast from '../../utilities/toast.utility';
import DayCalendar from '../../components/DayCalendar';
import Loading from '../../components/Loading';

export default function AgendarCoach({navigation}) {
  const user = useSelector(state => state.user);
  const {coach, sessions, cohort, timezone} = user;

  const [scheduled, setScheduled] = useState(false);
  const {date, hour, setDate} = useCoacheeCalendarContext();
  const {getCoachCalendar, isNotWorkingDay} = useCoachCalendar(coach?._id);
  const {loading, callEndpoint} = useFetchAndLoad();
  const lastSession = last(sessions);
  const {t} = useTranslation('global');

  const hasSession = date =>
    sessions.find(session => {
      const sessionDate = DateTime.fromISO(session.date).toISODate();
      const calendarDate = DateTime.fromJSDate(date).toISODate();
      if (sessionDate === calendarDate) {
        return true;
      }
      return false;
    });

  const getMyCoachCalendar = async () => {
    try {
      await getCoachCalendar();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!coach) {
      navigation.navigate('Dashboard');
    }
    getMyCoachCalendar();
  }, [coach]);

  const getHoursDifference = dateWithTimezone => {
    const currentDate = new Date();
    const sessionDateISO = new Date(dateWithTimezone).toISOString();
    const sessionDate = new Date(sessionDateISO);
    const hoursDifference =
      (sessionDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60);

    let currentHours = Math.round(hoursDifference);
    return currentHours;
  };

  const createCoachingSession = async () => {
    try {
      const dateWithTimezone = DateTime.fromMillis(hour.startHour.ts, {
        zone: timezone,
      }).toISO();

      let hours = getHoursDifference(dateWithTimezone);

      if (hours <= 24) {
        if (hours <= 24) {
          displayToast(`${t('pages.reschedule.timeLimit')}`, 'error');
          return;
        }

        return;
      }

      await callEndpoint(
        createSession({
          coach: coach._id,
          coachee: user.mongoID,
          date: dateWithTimezone,
        }),
      );
      // console.log(user.coach.calendar);
      const event = {
        title: t('pages.reschedule.eventTitle', {
          name: user.name,
          lastname: user.lastname,
        }),
        calendarId: user.coach.calendar.id,
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

      // Create event in coach calendar
      await callEndpoint(createEventOnCoachCalendar(event));
      setScheduled(true);
    } catch (error) {
      console.log(error);
      displayToast('Error', 'error');
    }
  };

  const errorDate = t('pages.reschedule.errorDate');
  const errorHour = t('pages.reschedule.errorHour');

  const handleSchedule = () => {
    if (!date) {
      displayToast(errorDate, 'error');
      return; // Mostrar un error
    }
    if (!hour) {
      displayToast(errorHour, 'error');
      return; // Mostrar error
    }
    // Registrar en backend
    createCoachingSession();
  };

  const tileDisabled = calendarDate => {
    if (isNotWorkingDay(calendarDate)) {
      return true;
    }
    if (hasSession(calendarDate)) {
      return false;
    }
    const today = DateTime.now().toISODate();
    const isoDate = DateTime.fromJSDate(calendarDate).toISODate();
    if (isoDate <= today) {
      return true;
    }
    if (lastSession) {
      const lastSessionDatePlusTenDays = DateTime.fromISO(lastSession.date)
        .plus({days: 5})
        .toISODate();

      if (isoDate <= lastSessionDatePlusTenDays) {
        return true;
      }
    }
  };

  if (scheduled) {
    return (
      <View>
        <Scheduled />
        <TouchableOpacity
          onPress={() => {
            navigation.pop();
          }}>
          {t('pages.reschedule.buttonOk')}
        </TouchableOpacity>
      </View>
    );
  }

  if (sessions?.length >= cohort?.program) {
    return <NoMoreSessions navigation={navigation} />;
  }

  if (loading) {
    console.log('loading');
    return <Loading title="Creando Sesión" />;
  }

  return (
    <ScrollView>
      <View
        style={tw.style('flex h-full justify-center bg-[#E4EFF8e8] px-8 py-8')}>
        <Text
          style={tw.style(
            'text-black mt-8 text-center text-base font-bold mb-6',
          )}>
          Este es el calendario de{' '}
          {user && user.coach
            ? `${user.coach.name} ${user.coach.lastname}`
            : ''}
        </Text>
        <Advice />
        <View style={tw.style('mb-6')}>
          <Calendar
            value={date}
            onDayPress={setDate}
            tileDisabled={({date: calendarDate}) => tileDisabled(calendarDate)}
          />
        </View>

        <Text style={tw.style('text-black text-center text-xl font-bold')}>
          {t('pages.reschedule.available')}
        </Text>

        {/* {date && hasSession(date) ? (
          <DayCalendar date={date} sessions={sessions} />
        ) : ( */}
        <AvailableSchedule handleSchedule={handleSchedule} />
        {/* )} */}
      </View>
    </ScrollView>
  );
}
