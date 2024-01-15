import React, { useState } from 'react';
import { uniqueId } from 'lodash';
import validationSchema from './validationSchema';
import { Formik, useFormik, FormikProvider } from 'formik';
import { Dropdown } from 'react-native-element-dropdown';
import {
    TextInput,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import tw from 'twrnc';

function AddEvaluator({ setAddEvaluator, handleAddEvaluator }) {
  const initialValues = {
    type: 'supervisor',
    name: '',
    lastname: '',
    email: ''
  };

  const data = [
    { label: 'Supervisor', value: 'supervisor' },
    { label: 'Subordinado', value: 'colaborator' },
    { label: 'Compañero', value: 'partner' },
  ];

  const [value, setValue] = useState(null);

  return (
    <View>
      <Formik
        initialValues={initialValues}
        onSubmit={(formValues) => {
          const { name, lastname, email } = formValues;
       
          handleAddEvaluator({
            id: uniqueId(`${value}`),
            name,
            lastname,
            email,
            type: value
          });
  
          setAddEvaluator(false);
        }}>
            {({values, errors, touched, handleChange, handleBlur, handleSubmit}) => {
      
          const { email, name, lastname } = values

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
                  'text-black bg-white px-8 py-2 text-sm rounded-full mt-8 shadow-md',
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
                placeholder="Nombre"
                placeholderTextColor={'#60636A'}
                style={tw.style(
                  'text-black bg-white px-8 py-3 text-sm rounded-full mt-4 shadow-md',
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
                placeholder="Apellido"
                placeholderTextColor={'#60636A'}
                style={tw.style(
                  'text-black bg-white px-8 py-3 text-sm rounded-full mt-4 shadow-md',
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
                placeholder="Correo Electrónico"
                placeholderTextColor={'#60636A'}
                style={tw.style(
                  'text-black bg-white px-8 py-3 text-sm rounded-full mt-4 shadow-md',
                )}
              />
              {errors.email && touched.email && (
                <Text style={tw.style('text-red-700 text-base mx-2 mt-2')}>
                  {errors.email}
                </Text>
              )}
              <View style={tw.style('flex-row justify-between')}>
                <TouchableOpacity
                  onPress={() => setAddEvaluator(false)}
                  style={tw.style(
                    'bg-[#173969] px-2 py-2 rounded-full mt-10 shadow-md w-[48%]',
                  )}
                >
                  <Text style={tw.style('text-white text-center text-xl')}>
                    Cancelar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={tw.style(
                    'bg-[#299EFF] px-2 py-2 rounded-full mt-10 shadow-md w-[48%]',
                  )}
                >
                  <Text style={tw.style('text-white text-center text-xl')}>
                    Guardar
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          );
        }}
      </Formik>
    </View>
  );
}

export default AddEvaluator;
