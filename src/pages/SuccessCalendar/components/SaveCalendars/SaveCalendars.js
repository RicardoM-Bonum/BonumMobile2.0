import { groupBy, map, size } from 'lodash';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import userCalendars from '../../../../adapters/userCalendars.adapter';
import NoData from '../../../../components/NoData/NoData';
import { useFetchAndLoad } from '../../../../hooks';
import {
  getUserCalendars,
  updateUserCalendars
} from '../../../../services/calendar.service';
import SavedCalendar from '../SavedCalendar';
import tw from 'twrnc';
import styles from './SaveCalendars.styles';
import { useNavigation } from '@react-navigation/native';
import { PrimaryButton } from '../../../../components/Buttons';
import displayToast from '../../../../utilities/toast.utility';

function SaveCalendars() {
  const { callEndpoint, loading } = useFetchAndLoad();
  const { mongoID } = useSelector((state) => state.user);
  const [calendars, setCalendars] = useState();
  const navigation = useNavigation();

  const getCalendars = async () => {
    try {
      const response = await callEndpoint(getUserCalendars(mongoID));
      setCalendars(userCalendars(response.data));
    } catch (error) {
      console.log('error');
    }
  };

  const saveCalendars = async () => {
    try {
      await callEndpoint(updateUserCalendars(calendars));
      displayToast('Calendario guardado correctamente.', 'info');
    } catch (error) {
      console.log(
        '🚀 ~ file: SaveCalendars.js ~ line 35 ~ saveCalendars ~ error',
        error
      );
    }
  };

  useEffect(() => {
    getCalendars();
    navigation.addListener('focus', () => {
      getCalendars();
    });
  }, []);

  useEffect(() => {}, [calendars]);

  return (
    <View style={tw.style(styles.MainContainer)}>
      <Text style={tw.style(styles.title)}>Calendarios</Text>
      <Text style={tw.style(styles.subtitle)}>
        Estos son tus calendarios, elige cuales te gustaría usar para tu
        disponibilidad en Bonum
      </Text>
      {size(calendars) > 0 ? (
        map(groupBy(calendars, 'email'), (group, index) => (
          <View style={tw.style(styles.group)} key={index}>
            <View className="SaveCalendars__group__title">
              {/* <Icon
                as={FcGoogle}
                className="SaveCalendars__group__title_icon"
              /> */}
              <Text style={tw.style(styles.group_title)}>{index}</Text>
            </View>
            {group.map((calendar) => (
              <SavedCalendar
                key={calendar.id}
                calendar={calendar}
                group={index}
                calendars={calendars}
                setCalendars={setCalendars}
              />
            ))}
          </View>
        ))
      ) : (
        <NoData title="No tienes ningun calendario" />
      )}

      {size(calendars) > 0 && (
        <View style={tw.style('flex-row justify-center')}>
          <PrimaryButton
            onPress={saveCalendars}
            loading={loading}
            title="Guardar Calendarios"
          />
        </View>
      )}
    </View>
  );
}

export default SaveCalendars;
