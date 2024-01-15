import React, { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { useFetchAndLoad, useUserUtilities } from '../../hooks';
import {
  createBonumCoachingCalendar,
  createUserCalendar,
  saveUserToken
} from '../../services/calendar.service';
import { size } from 'lodash';
import { updateUserCalendar } from '../../services/user.service';
import Loading from '../../components/Loading';
import NoData from '../../components/NoData/NoData';
import SaveCalendars from './components/SaveCalendars';
import displayToast from '../../utilities/toast.utility';

function SuccessCalendar({ route, navigation }) {
  const { refreshUser, userUtilitiesLoading } = useUserUtilities();
  const user = useSelector((state) => state.user);
  const { mongoID, providers, calendar } = user;
  const { loading, callEndpoint } = useFetchAndLoad();

  const saveCalendarToken = async () => {
    try {
      await callEndpoint(saveUserToken(route?.params?.code, mongoID));
      displayToast('Se conecto el calendario correctamente', 'success');
    } catch (error) {
      if (error.response.data.message !== 'No access token in response')
        console.log(error);
    }
  };

  const createCalendar = async () => {
    try {
      const bonumCalendar = await callEndpoint(
        createBonumCoachingCalendar(user.timezone, user.providers[0].provider)
      );

      const createMongoCalendar = await callEndpoint(
        createUserCalendar(bonumCalendar.data.data, user)
      );

      await callEndpoint(updateUserCalendar(user, createMongoCalendar.data));
      await refreshUser();
    } catch (error) {
      console.log(error);
    }
  };

  const saveCalendar = async () => {
    if (route?.params?.code) {
      await saveCalendarToken();
    }
    await refreshUser();
  };

  useEffect(() => {
    navigation.addListener('focus', () => {
      saveCalendar();
    });
  }, [navigation, route]);

  if (loading || userUtilitiesLoading)
    return <Loading title="Guardando calendario" />;

  if (size(providers) < 1)
    return <NoData title="Aún no tienes un proveedor de calendario" />;

  if (size(providers) > 0 && (!calendar || size(calendar) === 0)) {
    createCalendar();
    return <Loading title="Guardando Calendario" />;
  }

  return (
    <ScrollView>
      <SaveCalendars />
    </ScrollView>
  );
}

export default SuccessCalendar;
