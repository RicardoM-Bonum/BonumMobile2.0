import React, { useState } from 'react'

import {
  TextInput,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native'
import tw from 'twrnc'
import { Formik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import { setAboutYouCoach } from '../../redux/slices/onboarding'
import * as Yup from 'yup'
import 'react-native-gesture-handler'

export default function AboutYou({ navigation }) {
  const aboutYou = useSelector((state) => state.onboarding.aboutYouCoach)
  const dispatch = useDispatch()

  const validationSchema = Yup.object({
    resumen: Yup.string()
      .min(140, 'Debe ser minimo 140 caracteres')
      .required('El resumen es requerido'),
    comoTrabaja: Yup.string()
      .min(140, 'Debe ser minimo 140 caracteres')
      .required('Esta información es requerido')
  })

  const {
    handleSubmit,
    handleChange: formikHandleChange,
    values,
    errors,
    handleBlur,
    touched
  } = useFormik({
    initialValues: aboutYou,
    // validationSchema,
    onSubmit: () => {
      navigation.navigate('VideoIntro')
    }
  })

  const handleChange = (value, name) => {
    dispatch(
      setAboutYouCoach({ ...aboutYou, [name]: value })
    );
    formikHandleChange(name)(value);
  };


  return (
    <ScrollView>
      <View
        style={tw.style('flex h-full justify-center bg-[#E4EFF8e8] px-6 py-4')}
      >
        <Text style={tw.style('text-[#1E2843] text-center text-2xl')}>
          Cuéntanos acerca de ti:
        </Text>
        <Formik onSubmit={handleSubmit}>
          <>
            <TextInput
              onChangeText={(e) => handleChange(e, 'resume')}
              onBlur={handleBlur('resume')}
              placeholder="Resumen"
              placeholderTextColor={'#60636A'}
              multiline={true}
              numberOfLines={10}
              textAlignVertical="top"
              style={tw.style(
                'text-black bg-white px-8 py-5 rounded-[40px] mt-8 shadow-md text-base'
              )}
            />
            {errors.resume && touched.resume && (
              <Text style={tw.style('text-red-700 text-base mx-4 mt-2')}>
                {errors.resume}
              </Text>
            )}
            <TextInput
              onChangeText={(e) => handleChange(e, 'work')}
              onBlur={handleBlur('work')}
              placeholder="Como Trabaja"
              placeholderTextColor={'#60636A'}
              multiline={true}
              numberOfLines={10}
              textAlignVertical="top"
              style={tw.style(
                'text-black bg-white px-8 py-5 rounded-[40px] mt-8 shadow-md text-base'
              )}
            />
            {errors.work && touched.work && (
              <Text style={tw.style('text-red-700 text-base mx-4 mt-2')}>
                {errors.work}
              </Text>
            )}
            <TouchableOpacity
              onPress={handleSubmit}
              style={tw.style(
                'bg-[#299EFF] px-8 py-4 rounded-full mt-10 shadow-md'
              )}
            >
              <Text style={tw.style('text-white text-center text-xl')}>
                Siguiente
              </Text>
            </TouchableOpacity>
          </>
        </Formik>
      </View>
    </ScrollView>
  )
}
