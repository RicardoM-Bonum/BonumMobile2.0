import React, { useState, useEffect } from 'react';

import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import tw from 'twrnc';
import 'react-native-gesture-handler';
import { useSelector, useDispatch } from 'react-redux';
import { Image } from 'react-native';
import Advice from './CoacheeCalendar/components/Advice';
import Calendar from '../components/Calendar';
import useScheduleContext from './ScheduleAppointment/hooks/useScheduleContext';

export default function AgendarCoach({ navigation }) {
  const [selectedDate, setSelectedDate] = useState('');
  const user = useSelector((state) => state.user);
  const { date, hour, setDate } = useScheduleContext();

  const backScreen = () => {
    navigation.pop();
  };

  return (
    <ScrollView>
      <View
        style={tw.style('flex h-full justify-center bg-[#E4EFF8e8] px-8 py-8')}
      >
        <TouchableOpacity
          onPress={backScreen}
          style={tw.style('mt-10 absolute left-6 -top-2')}
        >
          <Image source={require('../assets/img/Flecha-der-1.png')} />
        </TouchableOpacity>
        <Text
          style={tw.style('text-black text-center text-base font-bold mb-6')}
        >
          Este es el calendario de{' '}
          {user && user.coach
            ? `${user.coach.name} ${user.coach.lastname}`
            : ''}
        </Text>
        <View style={tw.style('')}>
          <Calendar setSelectedDate={setSelectedDate} />
        </View>
        <Advice />
        <Text style={tw.style('text-black text-center text-xl font-bold')}>
          Horario Disponible
        </Text>

        {date && (
          <div className="ScheduleAppointment__available">
            <h4>{t('pages.reschedule.available')}</h4>
            <AvailableSchedule />
          </div>
        )}

        {/* <View style={tw.style('flex-row flex-wrap justify-center mt-4')}>
          <TouchableOpacity
            style={tw.style(
              'bg-[#FFFFFF] py-3 px-4 rounded-xl shadow-md mb-4 mr-4',
            )}
          >
            <Text style={tw.style('text-[#707070] text-center text-sm')}>
              9:30 - 10:00 AM
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw.style('bg-[#FFFFFF] py-3 px-4 rounded-xl shadow-md mb-4')}
          >
            <Text style={tw.style('text-[#707070] text-center text-sm')}>
              9:30 - 10:00 AM
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw.style(
              'bg-[#FFFFFF] py-3 px-4 rounded-xl shadow-md mb-4 mr-4',
            )}
          >
            <Text style={tw.style('text-[#707070] text-center text-sm')}>
              9:30 - 10:00 AM
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw.style('bg-[#FFFFFF] py-3 px-4 rounded-xl shadow-md mb-4')}
          >
            <Text style={tw.style('text-[#707070] text-center text-sm')}>
              9:30 - 10:00 AM
            </Text>
          </TouchableOpacity>
        </View> */}

        <TouchableOpacity
          style={tw.style('bg-[#299EFF] px-8 py-4 rounded-full mt-2 shadow-md')}
          onPress={() => {
            navigation.navigate('Dashboard');
          }}
        >
          <Text style={tw.style('text-white text-center text-xl')}>
            Agendar
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
