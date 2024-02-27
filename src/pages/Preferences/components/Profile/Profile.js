import {
  View,
  Text,
  Button,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/Entypo';
import {useDispatch, useSelector} from 'react-redux';
import {Input} from '@rneui/themed';
import {PrimaryButton} from '../../../../components/Buttons';
import {Formik, useFormik} from 'formik';
import {updateCoach} from '../../../../services/coach.service';
import displayToast from '../../../../utilities/toast.utility';
import {useFetchAndLoad} from '../../../../hooks';
import ChangeImage from './components/ChangeImage';
import ChangeVideo from './components/ChangeVideo';
import {modifyUser} from '../../../../redux/slices/user';
import {updateCoachee} from '../../../../services/coachee.service';
import {useListenNavigation} from '../../../../hooks/useListenNavigation';
import Loading from '../../../../components/Loading';
import {useTranslation} from 'react-i18next';
import YoutubePlayer from 'react-native-youtube-iframe';

export default function Profile({navigation}) {
  const user = useSelector(state => state.user);
  const {loading, callEndpoint} = useFetchAndLoad();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenVideo, setIsOpenVideo] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const {name, lastname, photo, video, role, email, phone, address} = user;
  const dispatch = useDispatch();
  const isCoach = role === 'coach';

  const {t} = useTranslation('global');

  useEffect(() => {
    if (user.video !== 'pending') {
      setVideoLoading(false);
    }
  }, [video, photo, user]);

  const initialValuesCoach = {
    emailpaypal: user.emailpaypal || '',
    phone: phone || '',
    address: address || '',
    howWork: user.howWork || undefined,
    resume: user.resume || undefined,
  };

  const initialValuesCoachee = {
    phone: phone || '',
    address: address || '',
  };

  const {
    handleSubmit,
    handleChange: formikHandleChange,
    values,
    errors,
    handleBlur,
    touched,
    setValues,
  } = useFormik({
    initialValues: isCoach ? initialValuesCoach : initialValuesCoachee,
    // validationSchema,
    onSubmit: async formValues => {
      try {
        const userUpdated = {
          ...formValues,
          id: user.mongoID,
        };
        if (isCoach) await callEndpoint(updateCoach(userUpdated));
        else await callEndpoint(updateCoachee(userUpdated));
        dispatch(modifyUser(formValues));
        displayToast('Datos cambiados con éxito', 'success');
        navigation.navigate('Profile');
      } catch (error) {
        console.log(error);
      }
    },
  });

  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback(state => {
    if (state === 'ended') {
      setPlaying(false);
      Alert.alert('video has finished playing!');
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying(prev => !prev);
  }, []);

  const extractVideoIdFromUrl = url => {
    // Expresión regular para extraer el ID del video de una URL de YouTube
    const regex = /[?&]v=([^&#]*)/;
    const match = url.match(regex);
    if (match && match[1]) {
      return match[1];
    } else {
      // Si la URL no coincide con el formato esperado, puedes manejar el caso aquí
      return null;
    }
  };

  return (
    <KeyboardAvoidingView behavior="position">
      <ScrollView style={tw.style('bg-[#E4EFF8e8] px-5 px-6')}>
        <View style={tw.style('my-10')}>
          <ChangeImage isOpen={isOpen} onClose={setIsOpen} />
          <ChangeVideo isOpen={isOpenVideo} onClose={setIsOpenVideo} />

          <Formik>
            <>
              <View
                style={tw.style(
                  'items-center bg-white py-4 px-4 mt-5 rounded-5',
                )}>
                {/* Foto */}
                <View style={tw.style('items-center mb-5')}>
                  <View style={tw.style('w-24 h-24')}>
                    <Image
                      source={{
                        uri: photo,
                      }}
                      style={tw.style('w-24 h-24 rounded-full')}
                    />
                    <TouchableOpacity
                      style={tw.style(
                        'bg-[#299eff] w-6 h-6 rounded-full justify-center items-center absolute bottom-0 right-0 opacity-80',
                      )}
                      onPress={() => setIsOpen(true)}>
                      <Icon name="pencil" color={'#1e2843'} size={20} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Nombre y apellido */}
                <View style={tw.style('w-full flex flex-row')}>
                  <Input
                    label={t('pages.preferences.profile.name')}
                    placeholder="P."
                    value={name}
                    containerStyle={{maxWidth: '50%'}}
                    disabled
                    labelStyle={{fontWeight: 'normal', fontSize: 14}}
                    inputStyle={{fontSize: 16}}
                  />
                  <Input
                    label={t('pages.preferences.profile.lastname')}
                    placeholder="Sherman"
                    value={lastname}
                    containerStyle={{maxWidth: '50%'}}
                    disabled
                    labelStyle={{fontWeight: 'normal', fontSize: 14}}
                    inputStyle={{fontSize: 16}}
                  />
                </View>

                {/* Correo*/}
                <Input
                  label={t('pages.preferences.profile.email')}
                  placeholder="Apellido"
                  value={email}
                  keyboardType="email-address"
                  disabled
                  labelStyle={{fontWeight: 'normal', fontSize: 14}}
                  inputStyle={{fontSize: 16}}
                />

                {/* Correo asociado a paypal */}
                {isCoach && (
                  <Input
                    label={t('pages.preferences.profile.paypalEmail')}
                    placeholder="Apellido"
                    value={values.emailpaypal}
                    onChangeText={formikHandleChange('emailpaypal')}
                    onBlur={handleBlur('emailpaypal')}
                    keyboardType="email-address"
                    labelStyle={{fontWeight: 'normal', fontSize: 14}}
                    inputStyle={{fontSize: 16}}
                  />
                )}

                {/* Télefono */}
                <Input
                  label={t('pages.preferences.profile.phone')}
                  placeholder="99768271"
                  value={values.phone}
                  onChangeText={formikHandleChange('phone')}
                  onBlur={handleBlur('phone')}
                  type
                  keyboardType="phone-pad"
                  labelStyle={{fontWeight: 'normal', fontSize: 14}}
                  inputStyle={{fontSize: 16}}
                />

                {/* Dirección */}
                {isCoach && (
                  <Input
                    label={t('pages.preferences.profile.address')}
                    placeholder="Calle Wallaby 42, Sydney"
                    value={values.address}
                    onChangeText={formikHandleChange('address')}
                    onBlur={handleBlur('address')}
                    multiline
                    labelStyle={{fontWeight: 'normal', fontSize: 14}}
                    inputStyle={{fontSize: 16}}
                  />
                )}

                {/* Coach */}
                {/* <Input
            label="Dirección"
            placeholder="Calle Wallaby 42, Sydney"
            value={address}
            multiline
            labelStyle={{ fontWeight: 'normal', fontSize: 14 }}
            inputStyle={{ fontSize: 16 }}
          /> */}
              </View>
              {isCoach && (
                <View>
                  <Text style={tw.style('mt-8 text-base ml-2')}>
                    {t('pages.preferences.profile.resume')}
                  </Text>
                  <TextInput
                    placeholder="Resumen"
                    placeholderTextColor={'#60636A'}
                    multiline={true}
                    textAlignVertical="top"
                    value={values.resume}
                    onChangeText={formikHandleChange('resume')}
                    onBlur={handleBlur('resume')}
                    style={tw.style(
                      'text-black bg-white px-8 py-4 rounded-3xl shadow-md text-base mt-4 min-h-40',
                    )}
                  />
                  <Text style={tw.style('mt-8 text-base ml-2')}>
                    {t('pages.preferences.profile.howWork')}
                  </Text>
                  <TextInput
                    placeholder="Como Trabaja"
                    placeholderTextColor={'#60636A'}
                    multiline={true}
                    textAlignVertical="top"
                    value={values.howWork}
                    onChangeText={formikHandleChange('howWork')}
                    onBlur={handleBlur('howWork')}
                    style={tw.style(
                      'text-black bg-white px-8 py-4 rounded-3xl shadow-md text-base mt-4 min-h-40',
                    )}
                  />
                </View>
              )}

              {isCoach && (
                <View>
                  {user.video !== 'pending' ? (
                    <>
                      <View style={tw.style('mt-8 text-base ml-2')}>
                        <YoutubePlayer
                          height={300}
                          play={playing}
                          videoId={extractVideoIdFromUrl(user?.video)}
                          onChangeState={onStateChange}
                          webViewStyle={{opacity: 0.99}}
                        />
                        {/* <Button
                          title={playing ? 'pause' : 'play'}
                          onPress={togglePlaying}
                        /> */}
                      </View>
                      {videoLoading && (
                        <View style={tw.style('my-1')}>
                          <Loading
                            title={t('pages.preferences.profile.loadingVideo')}
                            isFull={false}
                          />
                        </View>
                      )}
                      <PrimaryButton
                        title={t('pages.preferences.profile.changeVideo')}
                        onPress={() => setIsOpenVideo(true)}
                        style={tw.style('mt-4 bg-[#7cbeff]')}
                      />
                    </>
                  ) : (
                    <View style={tw.style('mt-12 mb-8')}>
                      <Text style={tw.style('text-center text-base')}>
                        {t('pages.preferences.profile.noVideo')}
                      </Text>
                      <PrimaryButton
                        title="Subir video"
                        onPress={() => setIsOpenVideo(true)}
                        style={tw.style('mt-4 bg-[#7cbeff]')}
                      />
                    </View>
                  )}
                </View>
              )}
              <PrimaryButton
                title={t('pages.preferences.profile.save')}
                onPress={handleSubmit}
                style={tw.style('mt-5')}
              />
            </>
          </Formik>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
