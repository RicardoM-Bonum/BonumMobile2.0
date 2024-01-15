import React from 'react';
import {
  TextInput,
  Text,
  View,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView
} from 'react-native';
import tw from 'twrnc';

import { useFormik, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { setAboutYouCoach } from '../../../../redux/slices/onboarding';
import validationSchema from './validationSchema';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from '../../../../components/Buttons';

function AboutYouCoach({ nextStep }) {
  const aboutYou = useSelector((state) => state.onboarding.aboutYouCoach);
  const dispatch = useDispatch();
  const { t } = useTranslation('global');

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
      nextStep();
    }
  });

  const handleChange = (value, name) => {
    dispatch(setAboutYouCoach({ ...aboutYou, [name]: value }));
    formikHandleChange(name)(value);
  };

  return (
    <View style={tw.style('flex justify-center bg-[#E4EFF8e8] px-6')}>
      <KeyboardAvoidingView behavior="position">
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
                'text-black bg-white px-8 py-4 rounded-3xl shadow-md text-base mt-8 h-30'
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
                'text-black bg-white px-8 py-4 rounded-3xl shadow-md text-base mt-8 h-30'
              )}
            />
            {errors.work && touched.work && (
              <Text style={tw.style('text-red-700 text-base mx-4 mt-2')}>
                {errors.work}
              </Text>
            )}
            <PrimaryButton
              title="Siguiente"
              onPress={handleSubmit}
              style={tw.style('mt-10')}
            />
          </>
        </Formik>
      </KeyboardAvoidingView>
    </View>
  );
}

export default AboutYouCoach;
