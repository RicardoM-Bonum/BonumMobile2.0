import React from 'react';
import CoacheeResumeContextWrapper from './context/CoacheeResumeContextWrapper';
import CoacheeResume from './CoacheeResume';

export default function ({ navigation, route }) {
  return (
    <CoacheeResumeContextWrapper>
      <CoacheeResume navigation={navigation} route={route} />
    </CoacheeResumeContextWrapper>
  );
}
