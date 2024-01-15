import React, { useEffect } from 'react';
import {
  TextInput,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Image
} from 'react-native';
import tw from 'twrnc';
import { Formik } from 'formik';
import validationSchema from './validationSchema';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'react-native-element-dropdown';
import { useFetchAndLoad } from '../../hooks';
import { registerCalendar } from '../../services/calendar.service';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../../components/Buttons';

function ConnectCalendar({ navigation }) {
  const initialValues = {
    provider: 'gmail',
    email: ''
  };

  const { loading, callEndpoint } = useFetchAndLoad();

  const providers = [
    { value: 'gmail', label: 'Gmail' },
    { value: 'outlook', label: 'Outlook' },
    { value: 'icloud', label: 'iCloud Mail' }
  ];

  const { t } = useTranslation('global');

  const getUri = async (formValues) => {
    try {
      const { data } = await callEndpoint(
        registerCalendar(formValues.email, formValues.provider, true)
      );
      await Linking.openURL(data.data);
    } catch (error) {
      console.log('error URI', error);
    }
  };

  const handleOpenURL = ({ url }) => {
    if (url.includes('code=')) {
      const splitURL = url.split('code=');
      navigation.navigate('SuccessCalendar', { code: splitURL[1] });
    }
  };

  const backScreen = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const listener = Linking.addEventListener('url', handleOpenURL);

    return () => listener.remove();
  }, []);

  return (
    <SafeAreaView edges={['right', 'left']}>
      <View style={tw.style('flex justify-center bg-[#E4EFF8e8] px-6 py-8')}>
        <Text style={tw.style('text-black text-center text-xl font-bold mt-5')}>
          Conectar Calendario
        </Text>
        <Text style={tw.style('text-[#707070] text-center text-sm mt-5 mb-4')}>
          Conectaremos el calendario de tu preferencia para ver tu
          disponibilidad
        </Text>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(formValues) => getUri(formValues)}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setValues
          }) => {
            const { email } = values;
            return (
              <>
                <Dropdown
                  data={providers}
                  value={values.provider}
                  placeholder="Gmail"
                  onChange={(item) => {
                    setValues({ ...values, provider: item.value });
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

                <PrimaryButton
                  title="Conectar Calendario"
                  onPress={handleSubmit}
                  style={tw.style('w-full mt-6')}
                />
              </>
            );
          }}
        </Formik>
      </View>
    </SafeAreaView>
  );
}

export default ConnectCalendar;
