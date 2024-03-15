import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import {Formik, useFormik} from 'formik';
import React, {useState} from 'react';
import tw from 'twrnc';
import validationSchema from './validationSchema';
import displayToast from '../../../../../../utilities/toast.utility';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';
import BasicLayout from '../../../../../../layouts/BasicLayout';
import {PrimaryButton} from '../../../../../../components/Buttons';
import PasswordInput from '../../../../../../components/Inputs/PasswordInput';
import {useTranslation} from 'react-i18next';

export default function ChangePassword({navigation}) {
  const [viewPassword, setViewPassword] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const {t} = useTranslation('global');

  const initialValues = () => ({
    current_password: '',
    new_password: '',
    new_password_confirm: '',
  });

  const {
    handleSubmit,
    handleChange,
    values,
    errors,
    handleBlur,
    touched,
    setValues,
    setTouched,
  } = useFormik({
    initialValues: initialValues(),
    validationSchema,
    onSubmit: async formValues => {
      setError(false);
      setLoading(true);
      try {
        const credential = auth.EmailAuthProvider.credential(
          auth().currentUser.email,
          formValues.current_password,
        );
        await auth().currentUser.reauthenticateWithCredential(credential);
        await auth().currentUser.updatePassword(formValues.new_password);
        displayToast('Contraseña cambiada con éxito', 'success');
        setValues(initialValues());
        setTouched(initialValues());
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log('hubo un error');
        console.log(err);
        if (err.code === 'auth/wrong-password') {
          displayToast('La contraseña actual es incorrecta', 'error');
          setError('La contraseña actual es incorrecta');
        } else {
          displayToast('Hubo un error', 'error');
        }
      }
    },
  });

  return (
    <KeyboardAvoidingView behavior="position">
      <ScrollView style={tw.style('bg-[#E4EFF8e8]')}>
        <View style={tw.style('px-6 py-8')}>
          <Text style={tw.style('text-center text-xl text-black')}>
            {t('pages.preferences.profile.changePassword')}
          </Text>
          <Formik onSubmit={handleSubmit}>
            <View style={tw.style('mt-6')}>
              <View>
                <Text style={tw.style('ml-4 text-base text-[#1a202c]')}>
                  {t('pages.preferences.profile.currentPassword')}
                </Text>
                <PasswordInput
                  placeholder={t('pages.preferences.profile.currentPassword')}
                  placeholderTextColor={'#60636A'}
                  defaultValue={values.current_password}
                  onChangeText={handleChange('current_password')}
                  onBlur={handleBlur('current_password')}
                />
                {errors.current_password && touched.current_password && (
                  <Text style={tw.style('text-red-700 text-base mx-4 mt-2')}>
                    {errors.current_password}
                  </Text>
                )}
              </View>
              <View>
                <Text style={tw.style('ml-4 text-base text-[#1a202c] mt-6')}>
                  {t('pages.preferences.profile.newPassword')}
                </Text>
                <PasswordInput
                  placeholder={t('pages.preferences.profile.newPassword')}
                  defaultValue={values.new_password}
                  onChangeText={handleChange('new_password')}
                  onBlur={handleBlur('new_password')}
                />
                {errors.new_password && touched.new_password && (
                  <Text style={tw.style('text-red-700 text-base mx-4 mt-2')}>
                    {errors.new_password}
                  </Text>
                )}
              </View>
              <View>
                <Text style={tw.style('ml-4 text-base text-[#1a202c] mt-6')}>
                  {t('pages.preferences.profile.confirmPassword')}
                </Text>
                <PasswordInput
                  placeholder={t('pages.preferences.profile.confirmPassword')}
                  defaultValue={values.new_password_confirm}
                  onChangeText={handleChange('new_password_confirm')}
                  onBlur={handleBlur('new_password_confirm')}
                />
                {errors.new_password_confirm &&
                  touched.new_password_confirm && (
                    <Text style={tw.style('text-red-700 text-base mx-4 mt-2')}>
                      {errors.new_password_confirm}
                    </Text>
                  )}
              </View>
              <PrimaryButton
                title={t('pages.preferences.profile.save')}
                onPress={handleSubmit}
                style={tw.style('mt-8')}
              />
            </View>
          </Formik>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
