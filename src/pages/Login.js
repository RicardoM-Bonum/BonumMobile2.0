import React, { useState } from 'react';

import {
  TextInput,
  Text,
  View,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView
} from 'react-native';
import tw from 'twrnc';
import { Formik } from 'formik';
import auth from '@react-native-firebase/auth';
// import { translateFirebaseErrors } from '../utilities/firebase.utility'
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/FontAwesome';
import 'react-native-gesture-handler';
import displayToast from '../utilities/toast.utility';
import { translateFirebaseErrors } from '../utilities';
import { useDispatch } from 'react-redux';
import useFetchAndLoad from '../hooks/useFetchAndLoad';
import { getUser } from '../services/user.service';
import userAdapter from '../adapters/user.adapter';
import Logo from '../assets/icons/bonum-logo.png';
import { PrimaryButton } from '../components/Buttons';
import TermsConditions from '../components/TermsConditions';
import PasswordInput from '../components/Inputs/PasswordInput';

export default function Login({ setLogin, loadingUser }) {
  const [termsOpen, setTermsOpen] = useState(false);
  const [hidePass, setHidePass] = useState(true);
  const [loading, setLoading] = useState(loadingUser);
  const dispatch = useDispatch();
  const { callEndpoint } = useFetchAndLoad();

  const getUserApi = async (id) => {
    try {
      const userData = await callEndpoint(getUser(id));
      return userData.data;
    } catch (error) {
      console.log({ error });
      return false;
    }
  };
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Ingrese un correo electrónico valido')
      .required('El correo electrónico es requerido'),
    password: Yup.string()
      .min(8, 'Debe ser minimo 8 caracteres')
      .required('Ingrese una contraseña'),
    passwordConfirmation: Yup.string().oneOf(
      [Yup.ref('password'), null],
      'Las contraseñas deben coincidir'
    )
  });

  const initialValues = {
    email: '',
    password: ''
  };

  return (
    <View
      style={tw.style(
        'bg-[#E4EFF8e8] px-6 w-full h-full justify-center relative items-center'
      )}
    >
      <TermsConditions isOpen={termsOpen} onClose={() => setTermsOpen(false)} />
      <KeyboardAvoidingView behavior="position">
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            marginTop: -100
          }}
        >
          <Image
            source={Logo}
            // resizeMode="contain"
            style={{
              width: 340,
              height: 200
            }}
          />
        </View>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (formValues) => {
            try {
              setLoading(true);
              await auth().signInWithEmailAndPassword(
                formValues.email.toLowerCase(),
                formValues.password
              );
              setLoading(false);
            } catch (error) {
              setLoading(false);
              console.log(error.code);
              displayToast(
                translateFirebaseErrors({ code: error.code }),
                'error'
              );
            }
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
            const { email, password } = values;

            return (
              <>
                <TextInput
                  value={email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  placeholder="Correo Electrónico"
                  placeholderTextColor={'#60636A'}
                  style={tw.style(
                    'text-black bg-white px-8 py-4 rounded-full shadow-md text-base'
                  )}
                />
                {errors.email && touched.email && (
                  <Text style={tw.style('text-red-700 text-base mx-4 mt-2')}>
                    {errors.email}
                  </Text>
                )}
                <PasswordInput
                  value={password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  placeholder="Contraseña"
                  containerStyle={tw.style('mt-5')}
                />
                {errors.password && touched.password && (
                  <Text style={tw.style('text-red-700 text-base mx-4 mt-2')}>
                    {errors.password}
                  </Text>
                )}

                <PrimaryButton
                  title="Iniciar Sesión"
                  onPress={handleSubmit}
                  style={{ marginTop: 25 }}
                  loading={loading}
                  disabled={loading}
                />

                <TouchableOpacity onPress={() => setLogin(false)}>
                  <Text
                    style={tw.style(
                      'text-center underline text-black mt-10 text-base'
                    )}
                  >
                    Olvide mi contraseña
                  </Text>
                </TouchableOpacity>
              </>
            );
          }}
        </Formik>
      </KeyboardAvoidingView>
      <TouchableOpacity
        onPress={() => setTermsOpen(true)}
        style={tw.style('absolute bottom-10')}
      >
        <Text style={tw.style('text-center underline text-black mt-6 text-sm')}>
          Terminos y condiciones
        </Text>
      </TouchableOpacity>
    </View>
  );
}
