import React from 'react';
import ScheduleContextWrapper from './context/ScheduleContextWrapper';
import ScheduleAppointment from './ScheduleAppointment';

function Schedule({navigation}) {
  return (
    <ScheduleContextWrapper>
      <ScheduleAppointment navigation={navigation} />
    </ScheduleContextWrapper>
  );
}

export default Schedule;
