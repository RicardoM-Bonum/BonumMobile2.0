import React, { useState } from 'react';

import {
  TextInput,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native';
import tw from 'twrnc';
import { Formik } from 'formik';

import * as Yup from 'yup';
import CheckBox from '@rneui/base';
import DatePicker from 'react-native-date-picker';
import 'react-native-gesture-handler';

export default function WorkingHours({ navigation }) {
  const [date, setDate] = useState(new Date());
  const [date2, setDate2] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [time, setTime] = useState(new Date());
  const [time2, setTime2] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [mode2, setMode2] = useState('time');

  const backScreen = () => {
    navigation.navigate('AvailableHours');
  };

  const handleSubmit = () => {
    navigation.navigate('MyCoachees');
  };

  const handleCancel = () => {
    navigation.navigate('AvailableHours');
  };

  return (
    <ScrollView>
      <View
        style={tw.style(
          'flex h-full justify-center bg-[#E4EFF8e8] px-6 relative'
        )}
      >
        <Text style={tw.style('text-black text-center text-xl font-bold')}>
          Bloquear horario de trabajo
        </Text>
        <Text style={tw.style('text-[#707070] text-center text-sm mt-5')}>
          Seleccione tiempo a bloquear
        </Text>

        <View style={tw.style('my-10')}>
          <View style={tw.style('flex-row justify-around items-center')}>
            <Text
              style={tw.style(
                'text-[#173969] text-left font-light mt-5 text-sm'
              )}
            >
              Fecha
            </Text>
            <View>
              <Text
                style={tw.style(
                  'text-[#173969] text-center font-light text-sm'
                )}
              >
                Desde
              </Text>
              <TouchableOpacity
                style={tw.style(
                  'bg-white rounded-2xl py-3 shadow-md w-24 mt-2'
                )}
                onPress={() => setOpen(true)}
              >
                <Text style={tw.style('text-[#1E2843] text-center')}>
                  {date.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={tw.style('items-center')}>
              <Text
                style={tw.style(
                  'text-[#173969] text-center font-light text-sm w-15'
                )}
              >
                Hasta
              </Text>
              <TouchableOpacity
                style={tw.style(
                  'bg-white rounded-2xl py-3 shadow-md w-24 mt-2'
                )}
                onPress={() => setOpen3(true)}
              >
                <Text style={tw.style('text-[#1E2843] text-center')}>
                  {date2.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={tw.style('flex-row justify-around items-center mt-4')}>
            <Text
              style={tw.style('text-[#173969] text-left font-light text-sm')}
            >
              Hora
            </Text>
            <TouchableOpacity
              style={tw.style('bg-white rounded-2xl py-3 shadow-md w-24')}
              onPress={() => setOpen2(true)}
            >
              <Text style={tw.style('text-[#1E2843] text-center')}>
                {time.toLocaleTimeString()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw.style('bg-white rounded-2xl py-3 shadow-md w-24')}
              onPress={() => setOpen4(true)}
            >
              <Text style={tw.style('text-[#1E2843] text-center')}>
                {time2.toLocaleTimeString()}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <DatePicker
          modal
          open={open}
          date={date}
          mode={mode}
          onConfirm={(date) => {
            setOpen(false);
            setDate(date);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
        <DatePicker
          modal
          open={open2}
          date={time}
          mode={mode2}
          onConfirm={(time) => {
            setOpen2(false);
            setTime(time);
          }}
          onCancel={() => {
            setOpen2(false);
          }}
        />
        <DatePicker
          modal
          open={open3}
          date={date2}
          mode={mode}
          onConfirm={(date2) => {
            setOpen3(false);
            setDate2(date2);
          }}
          onCancel={() => {
            setOpen3(false);
          }}
        />
        <DatePicker
          modal
          open={open4}
          date={time2}
          mode={mode2}
          onConfirm={(time2) => {
            setOpen4(false);
            setTime2(time2);
          }}
          onCancel={() => {
            setOpen4(false);
          }}
        />
        <TouchableOpacity
          onPress={handleCancel}
          style={tw.style('bg-[#707070] px-8 py-4 rounded-full shadow-md my-6')}
        >
          <Text style={tw.style('text-white text-center text-xl')}>
            Cancelar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSubmit}
          style={tw.style('bg-[#299EFC] px-8 py-4 rounded-full shadow-md mb-6')}
        >
          <Text style={tw.style('text-white text-center text-xl')}>
            Guardar
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
