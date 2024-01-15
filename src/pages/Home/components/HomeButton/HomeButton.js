import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import tw from 'twrnc';

export default function HomeButton({ children, onPress = () => {}, style }) {
  return (
    <TouchableOpacity
      style={{
        ...tw.style(
          'shadow-md rounded-2xl w-[45%] h-30 justify-center items-center px-4 text-center mb-6 bg-white'
        ),
        ...style
      }}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
}
