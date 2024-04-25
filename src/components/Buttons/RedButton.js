import React from 'react';
import {TouchableOpacity, Text} from 'react-native';

const RedButton = ({onPress, children}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: '#dc2727',
        height: 28,
        paddingHorizontal: 8,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 6.9,
      }}>
      <Text style={{color: '#ffffff', fontWeight: 'bold', fontSize: 12}}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

export default RedButton;
