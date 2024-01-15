import React, { useState } from 'react';

import { Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import tw from 'twrnc';
import CheckBox from '@rneui/base';
import DatePicker from 'react-native-date-picker';
import 'react-native-gesture-handler';

const DAYS = [
  {
    name: 'Domingo',
    active: true,
    start: new Date(),
    end: new Date()
  },
  {
    name: 'Lunes',
    active: true,
    start: new Date(),
    end: new Date()
  },
  {
    name: 'Martes',
    active: true,
    start: new Date(),
    end: new Date()
  },
  {
    name: 'Miércoles',
    active: true,
    start: new Date(),
    end: new Date()
  },
  {
    name: 'Jueves',
    active: true,
    start: new Date(),
    end: new Date()
  },
  {
    name: 'Viernes',
    active: true,
    start: new Date(),
    end: new Date()
  },
  {
    name: 'Sábado',
    active: true,
    start: new Date(),
    end: new Date()
  }
];

export default function AvailableHours({ navigation }) {
  const backScreen = () => {
    navigation.pop();
  };

  const [days, setDays] = useState(DAYS);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(true);

  const handleSubmit = () => {
    navigation.navigate('WorkingHours');
  };

  const handleCancel = () => {
    navigation.navigate('FocusAreas');
  };

  const handleChange = () => {
    if (checked) {
      setChecked(false);
    } else {
      setChecked(true);
    }
  };

  return (
    <ScrollView>
      <View
        style={tw.style(
          'flex h-full justify-center bg-[#E4EFF8e8] px-6 relative'
        )}
      >
        <Text
          style={tw.style(
            'text-[#1E2843] text-center font-bold text-3xl mt-10 mb-20'
          )}
        >
          Horarios de trabajo
        </Text>
        {days.length > 0 ? (
          days.map((day, index) => (
            <>
              <View
                style={tw.style(
                  'flex-row items-center justify-between mb-4 -ml-2'
                )}
              >
                <Text
                  style={tw.style(
                    'text-[#173969] text-left font-light text-sm w-16'
                  )}
                >
                  {day.name}
                </Text>
                <TouchableOpacity
                  style={tw.style(
                    'text-[#1E2843] text-center bg-white rounded-2xl text-sm px-4 py-2 shadow-md'
                  )}
                  onPress={() => setOpen(true)}
                >
                  <Text style={tw.style('text-[#1E2843] text-sm text-center')}>
                    {day.start.toLocaleTimeString()}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={tw.style(
                    'text-[#1E2843] text-center bg-white  rounded-2xl py-2 mr-2 shadow-md px-4'
                  )}
                  onPress={() => setOpen(true)}
                >
                  <Text style={tw.style('text-[#1E2843] text-center')}>
                    {day.end.toLocaleTimeString()}
                  </Text>
                </TouchableOpacity>
                <View style={tw.style('')}>
                  <CheckBox
                    uncheckedColor={'#E4EFF8e8'}
                    checkedColor={'#299EFC'}
                    boxStyle={{ borderColor: '#299EFC', borderWidth: 2 }}
                    checked={checked} // required
                    onPress={() => handleChange()}
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
          open={open}
          date={date}
          mode="time"
          onConfirm={(date) => {
            setOpen(false);
            setDate(date);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
        <TouchableOpacity
          onPress={handleCancel}
          style={tw.style('bg-[#707070] px-8 py-4 rounded-full mt-2 shadow-md')}
        >
          <Text style={tw.style('text-white text-center text-xl')}>
            Cancelar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSubmit}
          style={tw.style('bg-[#299EFC] px-8 py-4 rounded-full mt-6 shadow-md')}
        >
          <Text style={tw.style('text-white text-center text-xl')}>
            Guardar
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
