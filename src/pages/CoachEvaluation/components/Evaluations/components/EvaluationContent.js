import { View, Text, Image } from 'react-native';
import React from 'react';
import { Rating } from 'react-native-elements';
import tw from 'twrnc';
import { mongoDateToLongDate } from '../../../../../utilities';

export default function EvaluationContent({ evaluation, isSession }) {
  const { image, name, date, value, comment } = evaluation;
  return (
    <View style={tw.style('bg-white shadow-md rounded-2xl px-6 py-4 mb-4')}>
      <View style={tw.style('flex-row')}>
        <View style={tw.style('mr-4')}>
          <Image
            source={{ uri: image }}
            style={tw.style('w-12 h-12 rounded-full')}
          />
        </View>
        <View>
          <Text style={tw.style('font-bold text-base text-black')}>{name}</Text>
          <Text style={tw.style('text-base text-[#60636A]')}>
            {mongoDateToLongDate(date)}
          </Text>
          <Rating
            readonly
            imageSize={25}
            startingValue={value}
            style={tw.style('mt-1 items-start')}
          />
        </View>
      </View>
      {!isSession && (
        <View style={tw.style('mt-4')}>
          <Text style={tw.style('text-base text-[#60636A]')}>{comment}</Text>
        </View>
      )}
    </View>
  );
}
