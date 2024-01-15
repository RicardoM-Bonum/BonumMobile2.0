import React, { useEffect, useState } from 'react';
import {
  FormControl,
  Input,
  FormErrorMessage,
  InputGroup,
  Button,
  View,
  Text,
  KeyboardAvoidingView
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import tw from 'twrnc';
import { Formik, useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { setCreateYourAccount } from '../../../../redux/slices/onboarding';
import auth from '@react-native-firebase/auth';
import validationSchema from './validationSchema';
import { useTranslation } from 'react-i18next';
import { ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { PrimaryButton } from '../../../../components/Buttons';
import PrimaryInput from '../../../../components/Inputs/PrimaryInput';
import PasswordInput from '../../../../components/Inputs/PasswordInput';

function CreateYourAccount({ nextStep }) {
  const [viewPassword, setViewPassword] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const createYourAccount = useSelector(
    (state) => state.onboarding.createYourAccount
  );
  const { name, lastname } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { t } = useTranslation('global');

  const {
    handleSubmit,
    handleChange: formikHandleChange,
    values,
    errors,
    handleBlur,
    touched,
    setValues
  } = useFormik({
    initialValues: {
      name: name || '',
      lastname: name || '',
      old_password: '',
      password: ''
    },
    validationSchema,
    onSubmit: async (formValues) => {
      try {
        setLoading(true);
        const credential = auth.EmailAuthProvider.credential(
          auth().currentUser.email,
          formValues.old_password
        );
        await auth().currentUser.reauthenticateWithCredential(credential);
        await auth().currentUser.updatePassword(formValues.password);
        nextStep();
      } catch (err) {
        console.log({ err });
        console.log(err.code);
        setLoading(false);
        if (err.code === 'auth/wrong-password')
          setError('La contraseña actual es incorrecta');
      }

      setLoading(false);
    }
  });

  const handleChange = (field, value) => {
    dispatch(
      setCreateYourAccount({
        ...createYourAccount,
        [field]: value
      })
    );
    formikHandleChange(field)(value);
  };

  useEffect(() => {
    setValues({ name, lastname, password: '', old_password: '' });
    dispatch(setCreateYourAccount(values));
  }, []);

  useEffect(() => {
    dispatch(setCreateYourAccount(values));
  }, [values]);

  return (
    <View style={tw.style('flex justify-center bg-[#E4EFF8] px-6 pt-8')}>
      <Text style={tw.style('text-black text-center text-2xl')}>¡Hola!</Text>
      <Text style={tw.style('text-[#464648] text-center text-lg mt-2')}>
        {t('pages.onboarding.components.createYourAccount.subtitle')}
      </Text>
      <Formik onSubmit={handleSubmit}>
        <>
          <PrimaryInput
            placeholder={t(
              'pages.onboarding.components.createYourAccount.fieldName'
            )}
            style={tw.style('mt-6')}
            defaultValue={values.name}
            onChangeText={(e) => handleChange('name', e)}
            onBlur={handleBlur('name')}
          />
          {errors.name && touched.name && (
            <Text style={tw.style('text-red-700 text-base mx-4 mt-2')}>
              {errors.name}
            </Text>
          )}

          <PrimaryInput
            placeholder={t(
              'pages.onboarding.components.createYourAccount.fieldLastname'
            )}
            style={tw.style('mt-6')}
            defaultValue={values.lastname}
            onChangeText={(e) => handleChange('lastname', e)}
            onBlur={handleBlur('lastname')}
            placeholderTextColor={'#60636A'}
          />
          {errors.lastname && touched.lastname && (
            <Text style={tw.style('text-red-700 text-base mx-4 mt-2')}>
              {errors.lastname}
            </Text>
          )}

          <FormControl
            isInvalid={
              (errors?.old_password && touched.old_password) || errors.confirm
            }
          >
            <PasswordInput
              placeholder={t(
                'pages.onboarding.components.createYourAccount.fieldPassword'
              )}
              containerStyle={tw.style('mt-6')}
              onChangeText={(e) => handleChange('old_password', e)}
              onBlur={handleBlur('old_password')}
              placeholderTextColor={'#60636A'}
              type={viewPassword ? 'text' : 'password'}
            />
            {errors.old_password && touched.old_password && (
              <Text style={tw.style('text-red-700 text-base mx-4 mt-2')}>
                {errors.old_password}
              </Text>
            )}
          </FormControl>

          <FormControl
            isInvalid={(errors?.password && touched.password) || error}
          >
            <PasswordInput
              name="password"
              placeholder={t(
                'pages.onboarding.components.createYourAccount.fieldNewPassword'
              )}
              containerStyle={tw.style('mt-6')}
              onChangeText={(e) => handleChange('password', e)}
              onBlur={handleBlur('password')}
            />
            {errors.password && touched.password && (
              <Text style={tw.style('text-red-700 text-base mx-4 mt-2')}>
                {errors.password}
              </Text>
            )}

            {error && (
              <FormErrorMessage fontSize="lg">{error}</FormErrorMessage>
            )}
          </FormControl>

          <PrimaryButton
            title={t('pages.onboarding.components.createYourAccount.button')}
            onPress={handleSubmit}
            style={tw.style('mt-6')}
          />
        </>
      </Formik>
    </View>
  );
}

export default CreateYourAccount;
