import React from 'react';
import MyCoacheesContextWrapper from './context/MyCoacheesContextWrapper';
import MyCoachees from './MyCoachees';

export default function ({ navigation }) {
  return (
    <MyCoacheesContextWrapper>
      <MyCoachees navigation={navigation} />
    </MyCoacheesContextWrapper>
  );
}
