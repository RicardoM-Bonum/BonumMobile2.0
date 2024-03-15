import React, {useState} from 'react';
import {Formik, useFormik} from 'formik';
import * as Yup from 'yup';
import auth from '@react-native-firebase/auth';
import displayToast from '../../../utilities/toast.utility';
import {useTranslation} from 'react-i18next';
import {
  Dimensions,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import tw from 'twrnc';
import Logo from '../../../assets/icons/bonum-logo.png';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import {PrimaryButton} from '../../Buttons';

function ForgotPassword({setLogin}) {
  const [loading, setLoading] = useState(false);
  const {t} = useTranslation('global');

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Debe ser un correo válido')
      .required('El email es requerido'),
  });

  const initialValues = () => ({
    email: '',
  });

  const {handleSubmit, handleChange, values, errors, handleBlur, touched} =
    useFormik({
      initialValues: initialValues(),
      validationSchema,
      onSubmit: async ({email}) => {
        try {
          setLoading(true);
          await auth().sendPasswordResetEmail(email);
          displayToast(
            'Enviamos un correo con el enlace para que reestablezcas tu contraseña',
            'success',
          );
          setLogin(true);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          displayToast('Ups! tenemos un error, contacta a soporte', 'error');
        }
      },
    });

  return (
    <View style={tw.style('flex h-full justify-center bg-[#E4EFF8e8] px-6')}>
      <KeyboardAvoidingView behavior="position">
        <View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: -100,
            }}>
            <Image
              source={Logo}
              // resizeMode="contain"
              style={{
                width: 340,
                height: 200,
              }}
            />
          </View>

          <Text
            style={tw.style('text-black text-center text-2xl font-bold mt--6')}>
            {t('components.auth.forgotPassword.title')}
          </Text>
          <Text style={tw.style('text-black text-center text-base')}>
            {t('components.auth.forgotPassword.description')}
          </Text>
        </View>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit as any}>
          <>
            <TextInput
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              placeholder={
                t('components.auth.forgotPassword.placeholder') as string
              }
              placeholderTextColor={'#60636A'}
              style={tw.style(
                'text-black bg-white px-8 py-4 rounded-full mt-5 shadow-md text-base',
              )}
            />
            {errors.email && touched.email && (
              <Text style={tw.style('text-red-700 text-base mx-4 mt-2')}>
                {errors.email}
              </Text>
            )}

            <PrimaryButton
              title={t('components.auth.forgotPassword.button')}
              onPress={handleSubmit}
              style={{marginTop: 25}}
              loading={loading}
              disabled={loading}
            />

            <View style={tw.style('flex flex-row mt-6 justify-center')}>
              <Text style={tw.style('text-center text-black text-base')}>
                {t('components.auth.forgotPassword.remember')}{' '}
              </Text>
              <TouchableOpacity onPress={() => setLogin(true)}>
                <Text style={tw.style('underline text-black text-base')}>
                  {t('components.auth.forgotPassword.button2')}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        </Formik>
      </KeyboardAvoidingView>
    </View>
  );
}

export default ForgotPassword;
