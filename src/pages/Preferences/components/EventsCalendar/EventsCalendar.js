import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {useFetchAndLoad} from '../../../../hooks';
import {getValidEventsCalendars} from '../../../../services/calendar.service';
import {useDispatch, useSelector} from 'react-redux';
import displayToast from '../../../../utilities/toast.utility';
import {Text} from '@rneui/base';
import {PrimaryButton} from '../../../../components/Buttons';
import {updateCoachEventsCalendar} from '../../../../services/coach.service';
import {modifyUserEventCalendar} from '../../../../redux/slices/user';

const EventsCalendar = () => {
  const [calendars, setCalendars] = React.useState([]);
  const {mongoID, calendar} = useSelector(state => state.user);
  const {loading, callEndpoint} = useFetchAndLoad();
  const [selectedCalendar, setSelectedCalendar] = useState('');
  const [actualCalendar, setActualCalendar] = useState('');
  const dispatch = useDispatch();

  const convertCalendarsToReactSelect = calendars => {
    return calendars.map(calendar => {
      return {
        label: calendar.name,
        value: calendar._id,
      };
    });
  };

  const searchCalendar = (calendars, calendar) => {
    return calendars.find(item => item.value === calendar);
  };

  const fetchCalendars = async () => {
    try {
      const response = await callEndpoint(getValidEventsCalendars(mongoID));
      setCalendars(convertCalendarsToReactSelect(response.data.data));
    } catch (error) {
      displayToast('Error fetching calendars', 'error');
      console.error('Error fetching calendars:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      await callEndpoint(
        updateCoachEventsCalendar({
          coach: mongoID,
          calendarID: selectedCalendar.value,
        }),
      );
      displayToast('Calendario de eventos actualizado', 'success');
      dispatch(modifyUserEventCalendar(selectedCalendar.value));
    } catch (error) {
      displayToast('Error al actualizar el calendario', 'error');
      console.error('Error updating calendar:', error);
    }
  };

  useEffect(() => {
    fetchCalendars();
  }, []);

  useEffect(() => {
    setActualCalendar(searchCalendar(calendars, calendar));
  }, [calendars, calendar]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendario de Eventos</Text>
      <Text style={styles.subtitle}>
        Selecciona el calendario donde deseas que se agreguen los eventos de tus
        sesiones, Este cambio solo afectará a futuros eventos
      </Text>

      <Text style={styles.subtitle}>
        Calendario Actual:{' '}
        <Text style={styles.actualCalendar}>
          {actualCalendar ? actualCalendar.label : 'No seleccionado'}
        </Text>
      </Text>

      <Dropdown
        data={calendars}
        value={selectedCalendar || actualCalendar}
        // placeholder="Gmail"
        onChange={item => {
          setSelectedCalendar(item);
        }}
        style={styles.dropdown}
        labelField="label"
        valueField="value"
      />

      <PrimaryButton
        title="Guardar"
        onPress={handleSubmit}
        style={styles.button}
        loading={loading}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderRadius: 30,
    marginHorizontal: 10,
    marginTop: 20,
  },

  dropdown: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 12,
    borderRadius: 10,
    marginTop: 10,
    width: '100%',
    borderColor: '#60636A',
    borderWidth: 0.5,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
    color: '#60636A',
  },

  button: {
    marginTop: 20,
    width: '100%',
  },

  actualCalendar: {
    fontWeight: 'bold',
  },
});

export default EventsCalendar;
