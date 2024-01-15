import React from 'react';
import SessionContextWrapper from './context/SessionsContextWrapper';
import Session from './Session';

export default function ({ navigation, route }) {
  return (
    <SessionContextWrapper>
      <Session navigation={navigation} route={route} />
    </SessionContextWrapper>
  );
}
