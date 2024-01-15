import React from 'react';
import SessionInfoContextWrapper from './context/SessionInfoContextWrapper';
import SessionInfo from './SessionInfo';

export default function ({ navigation, route }) {
  return (
    <SessionInfoContextWrapper>
      <SessionInfo navigation={navigation} route={route} />
    </SessionInfoContextWrapper>
  );
}
