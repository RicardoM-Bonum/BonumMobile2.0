import React from 'react';
import { View } from 'react-native';

function EventWrapper({ event, children }) {
  const { isExecuted } = event;

  const isExecutedClass = isExecuted
    ? 'DayCalendar__card DayCalendar__card--executed'
    : 'DayCalendar__card';

  return <View className={isExecutedClass}>{children}</View>;
}

export default EventWrapper;
