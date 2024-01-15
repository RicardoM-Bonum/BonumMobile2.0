import { View, useWindowDimensions } from 'react-native';
import React from 'react';
import tw from 'twrnc';

export default function BasicLayout({ children }) {
  const { height } = useWindowDimensions();

  return (
    <View style={tw.style(`bg-[#E4EFF8e8] min-h-[${height}px]`)}>
      {children}
    </View>
  );
}
