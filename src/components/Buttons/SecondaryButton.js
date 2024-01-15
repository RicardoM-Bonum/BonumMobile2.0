import React from 'react';
import { Button } from '@rneui/base';

function SecondaryButton({
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
        backgroundColor: '#718096',
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 30,
        padding: 10,
        paddingVertical: 12,
        ...style
      }}
      disabled={disabled}
      titleStyle={{ ...titleStyle }}
    />
  );
}

export default SecondaryButton;
