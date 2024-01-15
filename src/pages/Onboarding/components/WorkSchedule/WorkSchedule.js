import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import tw from 'twrnc';
import CheckBox from '@rneui/base';
import DatePicker from 'react-native-date-picker';
import 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import { setWorkSchedule } from '../../../../redux/slices/onboarding';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from '../../../../components/Buttons';

const DAYS = [
  {
    id: 'Monday1',
    InitialDate: '08:00',
    Day: 'Monday',
    Work: true,
    EndDate: '17:00'
  },
  {
    id: 'Tuesday1',
    InitialDate: '08:00',
    Day: 'Tuesday',
    Work: true,
    EndDate: '17:00'
  },
  {
    id: 'Wednesday1',
    InitialDate: '08:00',
    Day: 'Wednesday',
    Work: true,
    EndDate: '17:00'
  },
  {
    id: 'Thursday1',
    InitialDate: '08:00',
    Day: 'Thursday',
    Work: true,
    EndDate: '17:00'
  },
  {
    id: 'Friday1',
    InitialDate: '08:00',
    Day: 'Friday',
    Work: true,
    EndDate: '17:00'
  },
  {
    id: 'Saturday1',
    InitialDate: '08:00',
    Day: 'Saturday',
    Work: true,
    EndDate: '17:00'
  },
  {
    id: 'Sunday1',
    InitialDate: '08:00',
    Day: 'Sunday',
    Work: true,
    EndDate: '17:00'
  }
];

export default function AvailableHours({ navigation, nextStep }) {
  const [days, setDays] = useState(DAYS);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const dispatch = useDispatch();

  const { t } = useTranslation('global');

  const handleScheduleChange = (date) => {
    const scheduleModified = selectedSchedule.day;
    const newSchedules = days.map((schedule) => {
      if (schedule.id !== scheduleModified.id) return schedule;
      if (selectedSchedule.type === 'initial') {
        return {
          ...scheduleModified,
          InitialDate: date
        };
      }

      return {
        ...scheduleModified,
        EndDate: date
      };
    });
    setDays(newSchedules);
    setOpen(false);
  };

  const handleScheduleCheckbox = (scheduleToModify) => {
    const newSchedules = days.map((schedule) => {
      if (schedule.id !== scheduleToModify.id) return schedule;

      return { ...scheduleToModify, Work: !schedule.Work };
    });
    setDays(newSchedules);
  };

  const formatHour = (date) => {
    const hour = DateTime.now().set({
      hour: date.split(':')[0],
      minute: date.split(':')[1]
    });
    const formatedHour = hour.toFormat('hh:mm a');

    return formatedHour;
  };

  const handleSchedulePicker = (day, type) => {
    setSelectedSchedule({ day, type });
    // setDate(getDate());
    setOpen(true);
  };

  const translateDay = (day) => {
    switch (day.toLowerCase()) {
      case 'monday':
        return t('pages.onboarding.components.workSchedule.days.monday');
      case 'tuesday':
        return t('pages.onboarding.components.workSchedule.days.tuesday');
      case 'wednesday':
        return t('pages.onboarding.components.workSchedule.days.wednesday');
      case 'thursday':
        return t('pages.onboarding.components.workSchedule.days.thursday');
      case 'friday':
        return t('pages.onboarding.components.workSchedule.days.friday');
      case 'saturday':
        return t('pages.onboarding.components.workSchedule.days.saturday');
      case 'sunday':
        return t('pages.onboarding.components.workSchedule.days.sunday');
      default:
        return t('pages.onboarding.components.workSchedule.days.monday');
    }
  };

  const handleSubmit = () => {
    nextStep();
  };

  useEffect(() => {
    dispatch(setWorkSchedule(days));
  }, [days]);

  return (
    <ScrollView>
      <View
        style={tw.style(
          'flex h-full justify-center bg-[#E4EFF8e8] px-6 relative'
        )}
      >
        <Text
          style={tw.style(
            'text-center font-bold text-xl text-black text-center mt-4 mb-8'
          )}
        >
          Horarios de trabajo
        </Text>
        {days.length > 0 ? (
          days.map((day, index) => (
            <>
              <View
                key={`${day._id}`}
                style={tw.style('flex-row items-center justify-between mb-4')}
              >
                <Text
                  style={tw.style(
                    'text-[#173969] text-left font-light text-sm w-16'
                  )}
                >
                  {translateDay(day.Day)}
                </Text>
                <TouchableOpacity
                  style={tw.style(
                    'text-[#1E2843] text-center bg-white rounded-2xl text-sm px-4 py-2 shadow-md'
                  )}
                  onPress={() => handleSchedulePicker(day, 'initial')}
                >
                  <Text
                    style={tw.style('text-[#1E2843] text-[12px] text-center')}
                  >
                    {formatHour(day.InitialDate)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={tw.style(
                    'text-[#1E2843] text-center bg-white  rounded-2xl py-2 mr-2 shadow-md px-4'
                  )}
                  onPress={() => handleSchedulePicker(day, 'end')}
                >
                  <Text
                    style={tw.style('text-[#1E2843] text-[12px] text-center')}
                  >
                    {formatHour(day.EndDate)}
                  </Text>
                </TouchableOpacity>
                <View style={tw.style('')}>
                  <CheckBox
                    uncheckedColor={'#E4EFF8e8'}
                    checkedColor={'#299EFC'}
                    boxStyle={{ borderColor: '#299EFC', borderWidth: 2 }}
                    checked={day.Work} // required
                    onPress={() => handleScheduleCheckbox(day)}
                  />
                </View>
              </View>
            </>
          ))
        ) : (
          <Text />
        )}

        <DatePicker
          modal
          locale="fr"
          open={open}
          date={date}
          mode="time"
          onConfirm={(date) => {
            handleScheduleChange(`${date.getHours()}:${date.getMinutes()}`);
          }}
          onCancel={() => {
            setOpen(false);
          }}
          is24hourSource="locale"
        />
        <PrimaryButton
          title="Guardar"
          onPress={handleSubmit}
          style={tw.style('mt-6')}
        />
      </View>
    </ScrollView>
  );
}
