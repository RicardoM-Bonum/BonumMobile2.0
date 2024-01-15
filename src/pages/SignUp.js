import React from 'react';

import { TextInput, Text, View, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { Formik } from 'formik';

import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/FontAwesome';
import CheckBox from '@react-native-community/checkbox';
import 'react-native-gesture-handler';

export default function SignUp({ navigation }) {
  const [hidePass, setHidePass] = React.useState(true);
  const [toggleCheckBox, setToggleCheckBox] = React.useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Ingrese un correo electrónico valido')
      .required('El correo electrónico es requerido'),
    password: Yup.string()
      .required('Ingrese una contraseña')
      .min(8, 'La contraseña requiere de 8 caracteres como mínimo'),
    passwordConfirmation: Yup.string()
      .required('Ingrese una contraseña')
      .min(8, 'La contraseña requiere de 8 caracteres como mínimo'),
    termsAndConditions: Yup.boolean().isTrue(toggleCheckBox),
  });

  const initialValues = {
    email: '',
    password: '',
  };

  return (
    <View style={tw.style('flex h-full justify-center bg-[#E4EFF8] px-6')}>
      <Text style={tw.style('text-black text-center text-2xl')}>Registro</Text>
      <Text style={tw.style('text-[#464648] text-center text-lg mt-2')}>
        Crea tu cuenta
      </Text>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, formikActions) => {
          alert('Datos enviados');
          navigation.navigate('MuestraTuSonrisa');
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => {
          const { email, password, passwordConfirmation } = values;

          return (
            <>
              <TextInput
                value={email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                placeholder="Correo Electrónico"
                placeholderTextColor={'#60636A'}
                style={tw.style(
                  'text-black bg-white px-8 py-4 text-base rounded-full mt-10 shadow-md',
                )}
              />
              {errors.email && touched.email && (
                <Text style={tw.style('text-red-700 text-base mx-4 mt-2')}>
                  {errors.email}
                </Text>
              )}

              <View>
                <TextInput
                  value={password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  secureTextEntry={hidePass}
                  placeholder="Contraseña Anterior"
                  placeholderTextColor={'#60636A'}
                  style={tw.style(
                    'text-black bg-white px-8 py-4 text-base rounded-full mt-6 shadow-md',
                  )}
                />
                {/*<Icon name="eye" color={"#000"} style={tw.style("absolute bottom-5.5 left-85")} size={25} onPress={() => setHidePass(!hidePass)} />*/}
              </View>
              {errors.password && touched.password && (
                <Text style={tw.style('text-red-700 text-base mx-4 mt-2')}>
                  {errors.password}
                </Text>
              )}

              <View>
                <TextInput
                  value={passwordConfirmation}
                  onChangeText={handleChange('passwordConfirmation')}
                  onBlur={handleBlur('passwordConfirmation')}
                  secureTextEntry={hidePass}
                  placeholder="Nueva Contraseña"
                  placeholderTextColor={'#60636A'}
                  style={tw.style(
                    'text-black bg-white px-8 py-4 text-base rounded-full mt-6 shadow-md',
                  )}
                />
                {/*<Icon name="eye" color={"#000"} style={tw.style("absolute bottom-5.5 left-85")} size={25} onPress={() => setHidePass(!hidePass)} />*/}
              </View>
              {errors.passwordConfirmation && touched.passwordConfirmation && (
                <Text style={tw.style('text-red-700 text-base mx-4 mt-2')}>
                  {errors.passwordConfirmation}
                </Text>
              )}

              <View
                style={tw.style('flex-row justify-center items-center mt-6')}
              >
                <CheckBox
                  style={tw.style('')}
                  disabled={false}
                  value={toggleCheckBox}
                  onValueChange={(newValue) => {
                    setToggleCheckBox(newValue);
                    handleChange('termsAndConditions');
                  }}
                  name="termsAndConditions"
                />

                <Text style={tw.style('text-center text-[#707070] text-base')}>
                  Acepto los{' '}
                  <Text
                    style={tw.style(
                      'underline text-black text-base text-sky-600',
                    )}
                  >
                    términos y condiciones
                  </Text>
                </Text>
              </View>

              <Text style={tw.style('text-red-700 text-base mx-10')}>
                {errors.termsAndConditions}
              </Text>

              <TouchableOpacity
                onPress={handleSubmit}
                style={tw.style(
                  'bg-[#299EFF] px-8 py-4 rounded-full mt-2 shadow-md',
                )}
              >
                <Text style={tw.style('text-white text-center text-xl')}>
                  Siguiente
                </Text>
              </TouchableOpacity>
            </>
          );
        }}
      </Formik>
    </View>
  );
}
