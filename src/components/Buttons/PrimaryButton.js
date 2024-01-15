import React from 'react';
import { Button } from '@rneui/base';

function PrimaryButton({
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
        backgroundColor: '#299EFF',
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 30,
        padding: 6,
        paddingVertical: 8,
        ...style
      }}
      disabled={disabled}
      titleStyle={{ ...titleStyle }}
    />
  );
}

export default PrimaryButton;
