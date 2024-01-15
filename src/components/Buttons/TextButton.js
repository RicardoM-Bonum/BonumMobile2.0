import React from 'react';
import { Button } from '@rneui/base';

function TextButton({
  loading = false,
  onPress = () => null,
  title = 'Click',
  disabled = false,
  style,
  titleStyle
}) {
  return (
    <Button
      title={title}
      loading={loading}
      onPress={onPress}
      buttonStyle={{
        backgroundColor: 'white',
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 30,
        padding: 0,
        alignSelf: 'flex-start',
        marginLeft: -7,
        ...style
      }}
      disabled={disabled}
      titleStyle={{
        ...titleStyle,
        fontSize: 14,
        color: 'black',
        fontWeight: 'bold',
        textDecorationLine: 'underline'
      }}
    />
  );
}

export default TextButton;
