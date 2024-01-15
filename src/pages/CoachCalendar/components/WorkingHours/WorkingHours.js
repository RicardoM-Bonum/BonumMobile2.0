import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import tw from 'twrnc';
import { CheckBox } from '@rneui/base';
import DatePicker from 'react-native-date-picker';
import 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { setWorkSchedule } from '../../../../redux/slices/onboarding';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { useFetchAndLoad } from '../../../../hooks';
import { saveUserWorkingHours } from '../../../../services/calendar.service';
import BasicLayout from '../../../../layouts/BasicLayout';
import { PrimaryButton, SecondaryButton } from '../../../../components/Buttons';

export default function WorkingHours({ setDisplayWorkingHours, schedules }) {
  const [days, setDays] = useState(schedules);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const dispatch = useDispatch();
  const { mongoID } = useSelector((state) => state.user);
  const { loading, callEndpoint } = useFetchAndLoad();

  const { t } = useTranslation('global');

  const saveWorkingHours = async () => {
    try {
      await callEndpoint(saveUserWorkingHours(days, mongoID));
      console.log('done');
      setDisplayWorkingHours(false);
    } catch (error) {
      // displayToast(errorSave, 'error');
    }
  };

  const formatHour = (date) => {
    const hour = DateTime.now().set({
      hour: date.split(':')[0],
      minute: date.split(':')[1]
    });
    const formatedHour = hour.toFormat('hh:mm a');

    return formatedHour;
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

  const handleScheduleChange = (date) => {
    const hour = DateTime.now().set({
      hour: date.split(':')[0],
      minute: date.split(':')[1]
    });
    const formatedHour = hour.toFormat('HH:mm');

    const scheduleModified = selectedSchedule.day;
    const newSchedules = days.map((schedule) => {
      if (schedule._id !== scheduleModified._id) return schedule;
      if (selectedSchedule.type === 'initial') {
        return {
          ...scheduleModified,
          InitialDate: formatedHour
        };
      }

      return {
        ...scheduleModified,
        EndDate: formatedHour
      };
    });
    setDays(newSchedules);
    setOpen(false);
  };

  const handleScheduleCheckbox = (scheduleToModify) => {
    const newSchedules = days.map((schedule) => {
      if (schedule._id !== scheduleToModify._id) return schedule;

      return { ...scheduleToModify, Work: !schedule.Work };
    });
    setDays(newSchedules);
  };

  const handleSchedulePicker = (day, type) => {
    setSelectedSchedule({ day, type });
    // setDate(getDate());
    setOpen(true);
  };

  const handleSubmit = () => {
    saveWorkingHours();
  };

  useEffect(() => {
    dispatch(setWorkSchedule(days));
  }, [days]);

  return (
    <ScrollView>
      <BasicLayout>
        <View style={tw.style('flex justify-center px-6 relative mt-8')}>
          <Text
            style={tw.style(
              'text-center font-bold text-xl text-black text-center mt-4 mb-8'
            )}
          >
            {t('pages.onboarding.components.workSchedule.title')}
          </Text>
          {days?.length > 0 ? (
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

                  <CheckBox
                    uncheckedColor={'#E4EFF8e8'}
                    checkedColor={'#299EFC'}
                    disabledStyle={{
                      borderColor: '#299EFC',
                      borderWidth: 2
                    }}
                    containerStyle={{ flex: 1, alignItems: 'center' }}
                    checked={day.Work} // required
                    onPress={() => handleScheduleCheckbox(day)}
                  />
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
            is24hourSource="device"
            title="Seleccionar Hora"
            confirmText="Confirmar"
            cancelText="Cancelar"
          />

          <PrimaryButton
            onPress={handleSubmit}
            title={t('pages.coachCalendar.buttonSave')}
            style={tw.style('mt-6')}
          />
          <PrimaryButton
            onPress={() => setDisplayWorkingHours(false)}
            title={t('pages.coachCalendar.buttonCancel')}
            style={tw.style('bg-[#707070] mt-4')}
          />
        </View>
      </BasicLayout>
    </ScrollView>
  );
}
