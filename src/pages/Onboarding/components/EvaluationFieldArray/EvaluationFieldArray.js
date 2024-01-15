import { View, Text, TextInput } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import { FieldArray, getIn } from 'formik';
import { size } from 'lodash';
import NoData from '../../../../components/NoData/NoData';

export default function EvaluationFieldArray({
  errors,
  touched,
  values,
  name,
  formik,
  label
}) {
  return (
    <View style={tw.style('mt-4')}>
      <Text style={tw.style('text-[#1E2843] text-left text-xl mt-3')}>
        {label}
      </Text>
      <View style={tw.style('flex-row justify-between w-full')}>
        <FieldArray name={name} validateOnChange>
          <View style={tw.style('w-full')}>
            {Array.isArray(values) && size(values) > 0 ? (
              values.map((object, index) => {
                const arrayName = `${name}[${index}].name`;
                const touchedArrayName = getIn(touched, arrayName);
                const errorArrayName = getIn(errors, arrayName);

                const arrayLastname = `${name}[${index}].lastname`;
                const touchedArrayLastname = getIn(touched, arrayLastname);
                const errorArrayLastname = getIn(errors, arrayLastname);

                const arrayEmail = `${name}[${index}].email`;
                const touchedArrayEmail = getIn(touched, arrayEmail);
                const errorArrayEmail = getIn(errors, arrayEmail);

                return (
                  <View
                    style={tw.style('w-full')}
                    key={object.id || object._id}
                  >
                    <View style={tw.style('flex-row justify-between')}>
                      <TextInput
                        value={object.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Nombre"
                        placeholderTextColor={'#60636A'}
                        style={tw.style(
                          'text-black bg-[#f1f0f0] px-8 py-2 text-sm rounded-full mt-4 shadow-md w-[48%]'
                        )}
                      />
                      <TextInput
                        value={object.lastname}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Apellido"
                        placeholderTextColor={'#60636A'}
                        style={tw.style(
                          'text-black bg-[#f1f0f0] px-8 py-2 text-sm rounded-full mt-4 shadow-md  w-[48%]'
                        )}
                      />
                    </View>

                    <TextInput
                      value={object.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Email"
                      placeholderTextColor={'#60636A'}
                      style={tw.style(
                        'text-black w-full bg-[#f1f0f0] px-8 py-2 text-sm rounded-full mt-4 shadow-md'
                      )}
                    />
                  </View>
                );
              })
            ) : (
              <View style={tw.style('-mb-4 mt--2')}>
                <NoData
                  title={`No tienes evaluadores ${label}`}
                  imageStyles={tw.style('w-14 h-14 mb-2')}
                />
              </View>
            )}
          </View>
        </FieldArray>
      </View>
    </View>
  );
}
