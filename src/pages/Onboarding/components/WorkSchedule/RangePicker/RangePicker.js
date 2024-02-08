import React, {useState} from 'react';
import DatePicker from 'react-native-modern-datepicker';
import moment from 'moment';
import CheckFalse from '../../../../../assets/icons/check_false.png';
import CheckTrue from '../../../../../assets/icons/check_true.png';
import {Image, Text, View} from 'native-base';
import tw from 'twrnc';
import {TextInput, TouchableOpacity} from 'react-native';
import {CheckBox} from '@rneui/base';
import 'react-native-gesture-handler';

function RangePicker({
  schedule,
  translateDay,
  handleScheduleChange,
  handleScheduleCheckbox,
  setOpen,
}) {
  const timePickerFormat = 'hh:mma';

  const [checked, setChecked] = useState(true);

  const handleChange = () => {
    if (checked) {
      setChecked(false);
    } else {
      setChecked(true);
    }
  };

  return (
    <View>
      <Text
        style={tw.style(
          'text-[#173969] text-left font-light text-sm mb--10 bottom-8 left-6',
        )}>
        {translateDay(schedule.Day)}
      </Text>
      <TouchableOpacity
        style={tw.style(
          'text-[#1E2843] text-center bg-white flex rounded-2xl mx-40 bottom-8 right-14 shadow-md mt-2',
        )}
        onPress={() => setOpen(true)}>
        <Text style={tw.style('text-[#1E2843] text-center')}>
          {schedule.InitialDate}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={tw.style(
          'text-[#1E2843] text-center bg-white flex rounded-2xl mx-40 bottom-17 left-15 shadow-md',
        )}
        onPress={() => setOpen(true)}>
        <Text style={tw.style('text-[#1E2843] text-center')}>
          {schedule.EndDate}
        </Text>
      </TouchableOpacity>
      <View style={tw.style('absolute left-87 bottom-19')}>
        <CheckBox
          uncheckedColor={'#E4EFF8e8'}
          checkedColor={'#299EFC'}
          boxStyle={{borderColor: '#299EFC', borderWidth: 2}}
          checked={checked}
          onPress={() => handleChange()}
        />
      </View>
    </View>
  );
}

export default RangePicker;
