import React, { useState, useEffect } from 'react';

import { TextInput, Text, View, TouchableOpacity, Image } from 'react-native';
import tw from 'twrnc';
import { Formik } from 'formik';

import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/FontAwesome';
import CheckBox from '@react-native-community/checkbox';
import 'react-native-gesture-handler';
import * as Progress from 'react-native-progress';

export default function BuscandoCoach({ navigation }) {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('ChooseCoach');
    }, 2000);
  }, [navigation]);

  return (
    <>
      <View
        style={tw.style('flex h-full justify-center items-center bg-[#E4EFF8]')}
      >
        <Text style={tw.style('text-black text-center text-xl mt-5')}>
          Buscando el coach perfecto
        </Text>
        <Progress.Circle
          size={150}
          indeterminate={true}
          style={tw.style('mt-5')}
        />
      </View>
    </>
  );
}
