import React, {useEffect, useState} from 'react';
import {ScrollView, TouchableOpacity, View, Image, Text} from 'react-native';
import Advice from './components/Advice';
import tw from 'twrnc';
import Calendar from './components/Calendar';
import {useSelector} from 'react-redux';
import {useFetchAndLoad} from '../../hooks';
import {
  getUserBlockSchedule,
  getUserWorkingHours,
} from '../../services/calendar.service';
import WorkingHours from './components/WorkingHours';
import {PrimaryButton} from '../../components/Buttons';
import displayToast from '../../utilities/toast.utility';
import BlockSchedule from './components/BlockSchedule/BlockSchedule';
import Sessions from './components/Sessions';
import {forEach} from 'lodash';
import {DateTime} from 'luxon';
import {useTranslation} from 'react-i18next';

function CoachCalendar({navigation}) {
  const {mongoID, sessions} = useSelector(state => state.user);
  const {callEndpoint} = useFetchAndLoad();
  const [schedules, setSchedules] = useState();
  const [blockedSchedules, setBlockedSchedules] = useState();
  const [displayWorkingHours, setDisplayWorkingHours] = useState(false);
  const [displayBlockSchedule, setDisplayBlockSchedule] = useState(false);
  const [date, setDate] = useState(new Date().toString());
  const [sessionsToDisplay, setSessionsToDisplay] = useState([]);

  const {t} = useTranslation('global');

  const getWorkingHours = async () => {
    try {
      const {data} = await callEndpoint(getUserWorkingHours(mongoID));
      setSchedules(data.data);
    } catch (error) {
      console.log('Working Hours Error');
    }
  };

  const getBlockedSchedule = async () => {
    try {
      const {data} = await callEndpoint(getUserBlockSchedule(mongoID));
      setBlockedSchedules(data.data);
    } catch (error) {
      displayToast('Error obteniendo los horarios bloqueados', 'error');
    }
  };

  const getSessionsToDisplay = () => {
    const sessionsTemp = [];

    forEach(sessions, session => {
      const selectedDate = DateTime.fromJSDate(date, {
        zone: 'utc',
      }).toISODate();

      const sessionDate = DateTime.fromISO(session?.date).toISODate();

      if (sessionDate === selectedDate) {
        sessionsTemp.push(session);
      }
    });

    setSessionsToDisplay(sessionsTemp);
  };

  useEffect(() => {
    getWorkingHours();
  }, [displayWorkingHours]);

  useEffect(() => {
    getBlockedSchedule();
  }, [displayBlockSchedule]);

  useEffect(() => {
    if (date) {
      getSessionsToDisplay();
    }
  }, [date]);

  if (displayWorkingHours) {
    return (
      <WorkingHours
        setDisplayWorkingHours={setDisplayWorkingHours}
        getWorkingHours={getWorkingHours}
        schedules={schedules}
      />
    );
  }

  if (displayBlockSchedule) {
    return (
      <BlockSchedule
        setDisplayBlockSchedule={setDisplayBlockSchedule}
        getBlockedSchedule={getBlockedSchedule}
        blockedSchedules={blockedSchedules}
      />
    );
  }

  return (
    <ScrollView>
      <View
        style={tw.style(
          'flex h-full justify-center bg-[#E4EFF8e8] px-8 py-8 mt--5',
        )}>
        <Advice />

        <PrimaryButton
          title={t('pages.coachCalendar.workingHours')}
          onPress={() => setDisplayWorkingHours(true)}
        />
        <PrimaryButton
          title={t('pages.coachCalendar.blockSchedule')}
          onPress={() => setDisplayBlockSchedule(true)}
          style={tw.style('mt-4 bg-[#173969]')}
        />

        <View style={tw.style('mb-6 mt-10')}>
          <Calendar
            schedules={schedules}
            blockedSchedules={blockedSchedules}
            onDayPress={setDate}
            value={date}
          />
          <View style={{marginTop: 15}}>
            {sessionsToDisplay?.length > 0 && date && (
              <Sessions date={date} sessionsToDisplay={sessionsToDisplay} />
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default CoachCalendar;
