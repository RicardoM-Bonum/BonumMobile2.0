import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import React, { useEffect } from 'react';
import tw from 'twrnc';
import { useFormik, Formik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { useFetchAndLoad, useUserUtilities } from '../../../../hooks';
import * as Yup from 'yup';
import { updateCoach } from '../../../../services/coach.service';
import displayToast from '../../../../utilities/toast.utility';
import { PrimaryButton } from '../../../../components/Buttons';
import { useTranslation } from 'react-i18next';

export default function AlternateCall({ navigation }) {
  const { alternateCall, mongoID } = useSelector((state) => state.user);
  const { loading, callEndpoint } = useFetchAndLoad();
  const { refreshUser } = useUserUtilities();
  const { t } = useTranslation('global');
  const validationSchema = Yup.object({
    link: Yup.string()
      .url('Ingrese una url correcta')
      .required('El link es requerido')
  });

  const {
    handleSubmit,
    handleChange,
    values,
    errors,
    handleBlur,
    touched,
    setValues,
    setTouched
  } = useFormik({
    initialValues: {
      link: alternateCall
    },
    validationSchema,
    onSubmit: async (form) => {
      try {
        await callEndpoint(
          updateCoach({ linkExternalCall: form.link, id: mongoID })
        );
        displayToast('Link guardado con èxito', 'success');
        setValues({ link: alternateCall });
        setTouched({ link: null });
        await refreshUser();
      } catch (error) {
        displayToast('Error al actualizar tú link', 'error');
        console.log(error);
      }
    }
  });

  return (
    <View style={tw.style('bg-[#E4EFF8e8] px-6 py-8 h-full')}>
      <Text style={tw.style('text-center font-bold text-lg text-black')}>
        {t('pages.preferences.alternateCall.title')}
      </Text>
      <Text style={tw.style('text-center mt-2 text-[#60636A]')}>
        {t('pages.preferences.alternateCall.subtitle')}
      </Text>
      <Formik>
        <>
          <View style={tw.style('mt-6')}>
            <View>
              <Text style={tw.style('ml-4 text-base text-[#1a202c]')}>
                {t('pages.preferences.alternateCall.linkPlaceholder')}
              </Text>
              <TextInput
                placeholder={t(
                  'pages.preferences.alternateCall.linkPlaceholder'
                )}
                placeholderTextColor={'#60636A'}
                style={tw.style(
                  'text-black bg-white px-8 py-4 rounded-full mt-2 shadow-md text-base'
                )}
                defaultValue=""
                onChangeText={handleChange('link')}
                onBlur={handleBlur('link')}
                value={values.link}
              />
              {errors.link && touched.link && (
                <Text style={tw.style('text-red-700 text-base mx-4 mt-2')}>
                  {errors.link}
                </Text>
              )}
            </View>
            <PrimaryButton
              title={t('pages.preferences.alternateCall.saveButton')}
              onPress={handleSubmit}
              style={tw.style('mt-10')}
            />
          </View>
        </>
      </Formik>
    </View>
  );
}
