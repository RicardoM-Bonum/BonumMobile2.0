import React from 'react';
import RescheduleContextWrapper from './context/RescheduleContextWrapper';
import RescheduleAppointment from './RescheduleAppointment';

function Reschedule({ navigation, route }) {
  return (
    <RescheduleContextWrapper>
      <RescheduleAppointment navigation={navigation} route={route} />
    </RescheduleContextWrapper>
  );
}

export default Reschedule;
