import {View, Text, TouchableOpacity, Image, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import tw from 'twrnc';
import Calendar from './components/Calendar';
import {useFetchAndLoad} from '../../../../hooks';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {
  deleteCoachCalendar,
  getUserCalendars,
  updateUserCalendars,
} from '../../../../services/calendar.service';
import userCalendars from '../../../../adapters/userCalendars.adapter';
import {groupBy, map, size} from 'lodash';
import NoData from '../../../../components/NoData/NoData';
import SavedCalendar from '../../../SuccessCalendar/components/SavedCalendar';
import {PrimaryButton, SecondaryButton} from '../../../../components/Buttons';
import {useTranslation} from 'react-i18next';
import displayToast from '../../../../utilities/toast.utility';

export default function Calendars({navigation}) {
  const {callEndpoint, loading} = useFetchAndLoad();
  const {mongoID} = useSelector(state => state.user);
  const [calendars, setCalendars] = useState();

  const {t} = useTranslation('global');

  const getCalendars = async () => {
    try {
      const response = await callEndpoint(getUserCalendars(mongoID));
      setCalendars(userCalendars(response.data));
    } catch (error) {
      console.log('error');
      console.log(error);
    }
  };

  const saveCalendars = async () => {
    try {
      await callEndpoint(updateUserCalendars(calendars));
    } catch (error) {
      console.log(
        '🚀 ~ file: SaveCalendars.js ~ line 35 ~ saveCalendars ~ error',
        error,
      );
    }
  };

  const handleDeleteCalendar = async calendar => {
    try {
      await callEndpoint(deleteCoachCalendar(calendar));
      displayToast('Calendario borrado con éxito', 'success');
      getCalendars();
    } catch (error) {
      console.log(error);
      displayToast(error.response.data.message, 'error');
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
    <ScrollView>
      <View style={tw.style('px-6 py-8 bg-[#E4EFF8e8] h-full justify-center')}>
        <View>
          <Text
            style={tw.style('text-center font-bold text-black text-lg mb-2')}>
            {t('pages.preferences.calendar.title')}
          </Text>
          <Text style={tw.style('text-center text-[#60636A]')}>
            {t('pages.preferences.calendar.subtitle')}
          </Text>
          <PrimaryButton
            title={t('pages.preferences.calendar.connectButton')}
            onPress={() => navigation.navigate('connectcalendar')}
            style={tw.style('my-4')}
          />
        </View>
        {size(calendars) > 0 ? (
          map(groupBy(calendars, 'email'), (group, index) => (
            <View
              style={tw.style('mt-6 bg-white shadow-md rounded-2xl px-6 py-6')}>
              <View className="SaveCalendars__group__title">
                <Text style={tw.style('text-black text-base mb-4')}>
                  {index}
                </Text>
              </View>
              {group.map(calendar => (
                <SavedCalendar
                  key={calendar.id}
                  calendar={calendar}
                  group={index}
                  calendars={calendars}
                  setCalendars={setCalendars}
                />
              ))}

              <SecondaryButton
                title={'Eliminar'}
                onPress={() => handleDeleteCalendar(group[0].email)}
                style={{marginTop: 8, backgroundColor: '#f94015'}}
                styles
              />
            </View>
          ))
        ) : (
          <NoData title="No tienes ningun calendario" />
        )}
        <View>
          <PrimaryButton
            title={t('pages.preferences.calendar.saveButton')}
            onPress={saveCalendars}
            style={tw.style('mt-4')}
          />
        </View>
      </View>
    </ScrollView>
  );
}
