import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import tw from 'twrnc';
import Calendar from '../Calendar';
import Advice from '../../pages/CoacheeCalendar/components/Advice';
import { useCoachCalendar } from '../../hooks';
import { PrimaryButton } from '../Buttons';
import { translateDay } from '../../utilities/translateDays.utility';

export default function ViewCoachCalendar({ isOpen, onClose, coach }) {
  // const [workingHours] = useState(WORKING_HOURS);
  const { workingHours, getCoachCalendar } = useCoachCalendar(coach?._id);

  useEffect(() => {
    getCoachCalendar();
  }, [coach]);

  useEffect(() => {}, [workingHours]);

  useEffect(() => {
    getCoachCalendar();
  }, []);

  useEffect(() => {}, [workingHours]);

  const reflectWorkingHours = (date) => {
    if (isNotWorkingDay(date)) return 'session session--notworking';
  };

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isOpen}
        style={tw.style('justify-center items-center my-4')}
      >
        <ScrollView>
          <View
            style={tw.style(
              'px-6 py-8 mx-6 my-14 bg-white shadow-md rounded-3xl'
            )}
          >
            <Text
              style={tw.style(
                'text-black text-center text-base font-bold mb-6'
              )}
            >
              Este es el calendario del coach {coach?.name} {coach?.lastname}
            </Text>
            <View style={tw.style('')}>
              {workingHours && (
                <View>
                  {workingHours.map((schedule) => (
                    <View key={schedule.Day} style={tw.style('mt-2')}>
                      <Text
                        style={tw.style(
                          'font-bold text-center text-base text-black mb-1'
                        )}
                      >
                        {translateDay(schedule.Day)}
                      </Text>
                      {schedule.Work ? (
                        <Text
                          style={tw.style('text-center text-sm text-[#60636A]')}
                        >
                          {schedule.InitialDate} - {schedule.EndDate}
                        </Text>
                      ) : (
                        <Text style={tw.style('text-center text-[#60636A]')}>
                          Dia no laborable
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
            <PrimaryButton
              onPress={onClose}
              title="Cerrar"
              style={tw.style('bg-[#707070] mt-6')}
            />
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}
