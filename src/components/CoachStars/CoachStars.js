import { View, Text, Image } from 'react-native';
import React from 'react';
import tw from 'twrnc';

export default function CoachStars({ value = 5, containerStyle, starsStyle }) {
  const iteration = new Array(value).fill(0);
  return (
    <View style={{ ...tw.style('flex-row mt-2'), ...containerStyle }}>
      {iteration.map((value, index) => (
        <Image
          key={`star-${index}`}
          source={require('../../assets/icons/estrella.png')}
          style={{ ...tw.style('w-7 h-7 mr-2'), ...starsStyle }}
        />
      ))}
    </View>
  );
}
