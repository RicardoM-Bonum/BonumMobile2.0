import { View, Text, Image } from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function ImageMessage({ onPress, style, source }) {
  return (
    <View style={{ borderRadius: 15, padding: 2 }}>
      <TouchableOpacity onPress={onPress}>
        <Image resizeMode="contain" style={style} source={source} />
      </TouchableOpacity>
    </View>
  );
}
