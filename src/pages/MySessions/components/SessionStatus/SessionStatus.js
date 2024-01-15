import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import tw from 'twrnc';

export default function SessionStatus(props) {
  const { status, canceled } = props;
  const [label, setLabel] = useState({ color: '#f4a21f', message: '' });

  const getLabel = () => {
    if (status) {
      setLabel({
        color: '#55e592',
        message: 'Completada'
      });

      return;
    }

    if (canceled) {
      setLabel({
        color: '#f94015',
        message: 'Cancelada'
      });

      return;
    }

    setLabel({
      color: '#f4a21f',
      message: 'Pendiente'
    });
  };

  useEffect(() => {
    getLabel();
  }, []);

  useEffect(() => {}, [label]);

  return (
    <Text
      style={tw.style(
        `text-[${label.color}] border border-[${label.color}] p-1 rounded-md text-xs`
      )}
    >
      {label.message}
    </Text>
  );
}
