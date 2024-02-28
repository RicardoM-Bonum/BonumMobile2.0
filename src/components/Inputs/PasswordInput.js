import {StyleSheet, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function PasswordInput(props) {
  const {value, onChangeText, onBlur, placeholder, style, containerStyle} =
    props;
  const [hidePass, setHidePass] = useState(true);

  return (
    <View
      style={{
        ...tw.style('w-full text-base flex-row justify-center'),
        ...styles.input,
        ...containerStyle,
      }}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        secureTextEntry={hidePass}
        placeholder={placeholder}
        placeholderTextColor={'#60636A'}
        style={{
          ...tw.style(
            'text-black bg-transparent pl-10 py-0 my-0 w-full text-base',
          ),
          ...style,
        }}
        {...props}
      />
      <Icon
        name="eye"
        color={'#000'}
        size={25}
        onPress={() => setHidePass(!hidePass)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderColor: '#e6e6e6',
    borderWidth: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    minHeight: 50,
    fontSize: 18,
    paddingVertical: 20,
    fontWeight: 300,
    paddingRight: 12,
  },
});
