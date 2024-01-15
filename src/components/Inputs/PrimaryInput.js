import { TextInput } from 'react-native';
import React from 'react';
import tw from 'twrnc';

export default function PrimaryInput(props) {
  const { value, onChangeText, onBlur, placeholder, style } = props;
  return (
    <TextInput
      {...props}
      value={value}
      onChangeText={onChangeText}
      onBlur={onBlur}
      placeholder={placeholder}
      placeholderTextColor={'#60636A'}
      style={{
        ...tw.style(
          'text-black bg-white px-8 py-4 rounded-full shadow-md text-base'
        ),
        ...style
      }}
    />
  );
}
