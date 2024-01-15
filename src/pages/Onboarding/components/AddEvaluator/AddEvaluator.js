import React, { useState } from 'react';
import {
  FormControl,
  Input,
  Button,
  FormErrorMessage,
  Select
} from 'native-base';
import {
  TextInput,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native';
import tw from 'twrnc';
import { Formik, useFormik } from 'formik';
import { uniqueId } from 'lodash';
import validationSchema from './validationSchema';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'react-native-element-dropdown';
import { PrimaryButton } from '../../../../components/Buttons';

function AddEvaluator({ setAddEvaluator, handleAddEvaluator }) {
  const initialValues = {
    type: 'supervisor',
    name: '',
    lastname: '',
    email: ''
  };

  const data = [
    { label: 'Supervisor', value: 'supervisor' },
    { label: 'Colaborador', value: 'colaborator' },
    { label: 'Compañero', value: 'partner' }
  ];

  const { mongoID } = useSelector((state) => state.user);
  const { t } = useTranslation('global');

  const [value, setValue] = useState('supervisor');

  return (
    <KeyboardAvoidingView behavior="position">
      <View style={tw.style('flex px-6 py-8 h-full mt--6')}>
        <Text style={tw.style('text-black text-center text-xl font-bold')}>
          {t('pages.onboarding.components.addEvaluator.title')}
        </Text>
        <Text style={tw.style('text-[#707070] text-center text-sm mt-5')}>
          {t('pages.onboarding.components.addEvaluator.subtitle')}
        </Text>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(formValues) => {
            const { name, lastname, email } = formValues;

            handleAddEvaluator({
              id: uniqueId(`${value}`),
              name,
              lastname,
              email,
              type: value,
              coachee: mongoID
            });

            setAddEvaluator(false);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit
          }) => {
            const { email, name, lastname } = values;
            return (
              <>
                <Dropdown
                  data={data}
                  value={value}
                  placeholder="Supervisor"
                  onChange={(item) => {
                    setValue(item.value);
                  }}
                  style={tw.style(
                    'text-black bg-white px-8 py-2 text-sm rounded-full mt-8 shadow-md'
                  )}
                  placeholderStyle={tw.style('text-gray-500 text-sm')}
                  selectedTextStyle={tw.style('text-black text-sm')}
                  labelField="label"
                  valueField="value"
                />
                <TextInput
                  value={name}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  placeholder={t(
                    'pages.onboarding.components.addEvaluator.fieldName'
                  )}
                  placeholderTextColor={'#60636A'}
                  style={tw.style(
                    'text-black bg-white px-8 py-3 text-sm rounded-full mt-4 shadow-md'
                  )}
                />
                {errors.name && touched.name && (
                  <Text style={tw.style('text-red-700 text-base mx-2 mt-2')}>
                    {errors.name}
                  </Text>
                )}

                <TextInput
                  value={lastname}
                  onChangeText={handleChange('lastname')}
                  onBlur={handleBlur('lastname')}
                  placeholder={t(
                    'pages.onboarding.components.addEvaluator.fieldLastname'
                  )}
                  placeholderTextColor={'#60636A'}
                  style={tw.style(
                    'text-black bg-white px-8 py-3 text-sm rounded-full mt-4 shadow-md'
                  )}
                />
                {errors.lastname && touched.lastname && (
                  <Text style={tw.style('text-red-700 text-base mx-2 mt-2')}>
                    {errors.lastname}
                  </Text>
                )}
                <TextInput
                  value={email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  placeholder={t(
                    'pages.onboarding.components.addEvaluator.fieldEmail'
                  )}
                  placeholderTextColor={'#60636A'}
                  style={tw.style(
                    'text-black bg-white px-8 py-3 text-sm rounded-full mt-4 shadow-md'
                  )}
                />
                {errors.email && touched.email && (
                  <Text style={tw.style('text-red-700 text-base mx-2 mt-2')}>
                    {errors.email}
                  </Text>
                )}
                <View style={tw.style('mt-10')}>
                  <PrimaryButton
                    title={t(
                      'pages.onboarding.components.addEvaluator.buttonSave'
                    )}
                    onPress={handleSubmit}
                  />
                  <PrimaryButton
                    title={t(
                      'pages.onboarding.components.addEvaluator.buttonCancel'
                    )}
                    onPress={() => setAddEvaluator(false)}
                    style={tw.style('bg-[#707070] mt-4')}
                  />
                </View>
              </>
            );
          }}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  );
}

export default AddEvaluator;
