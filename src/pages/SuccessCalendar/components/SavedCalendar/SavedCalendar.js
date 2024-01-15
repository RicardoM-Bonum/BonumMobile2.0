import React, { useContext } from 'react';
// import { Checkbox } from '@chakra-ui/react';
// import SuccessCalendarContext from 'pages/SuccessCalendar/context/SuccessCalendarContext';
import { View, Text } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import tw from 'twrnc';

function SavedCalendar({ calendar, calendars, setCalendars }) {
  const isBonumCalendar = (calendarToCheck) =>
    calendarToCheck.name.includes('Calendario Bonum');

  const handleCalendarChange = (calendarData) => {
    setCalendars(
      calendars.map((tempCalendar) => {
        if (tempCalendar.id !== calendarData.id) return tempCalendar;
        return { ...tempCalendar, active: !calendarData?.active };
      })
    );
  };

  return (
    <View style={tw.style('flex flex-row items-center')}>
      <CheckBox
        value={calendar.active || isBonumCalendar(calendar)}
        // disabled={isBonumCalendar(calendar)}
        defaultChecked={isBonumCalendar(calendar)}
        onChange={() => handleCalendarChange(calendar)}
        onFillColor={'#299eff'}
        tintColor={'#299eff'}
        tintColors={{
          true: '#299eff',
          false: 'transparent',
          disabled: '#299dfcd6'
        }}
        style={{ marginRight: 10, marginBottom: 10 }}
      />
      <Text style={tw.style('text-[#60636A] flex-1')}>{calendar.name}</Text>
    </View>
  );
}

export default SavedCalendar;
