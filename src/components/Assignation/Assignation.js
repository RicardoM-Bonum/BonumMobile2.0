import { View, Text, Switch } from 'react-native';
import React, { useState } from 'react';
import tw from 'twrnc';
import { mongoDateToShortDate } from '../../utilities';

export default function Assignation({ assignation, onChange }) {
  return (
    <View style={tw.style('flex-row border-[#b1b1b1] border-t py-3')}>
      <Switch
        trackColor={{ false: '#767577', true: '#299eff' }}
        thumbColor={assignation.status ? 'white' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onChange={() => onChange(assignation)}
        value={assignation?.status}
      />
      <View style={tw.style('ml-2')}>
        <Text style={tw.style('font-bold text-base text-black ')}>
          {assignation?.title}
        </Text>
        <Text style={tw.style('text-base my-1 text-[#60636A]')}>
          {mongoDateToShortDate(assignation?.date)}
        </Text>
        <Text style={tw.style('text-[#a6a6a6]')}>
          Sesión {assignation?.session}
        </Text>
      </View>
    </View>
  );
}
