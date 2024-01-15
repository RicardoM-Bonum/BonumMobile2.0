import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import BonumCalendar from '../../../../components/Calendar';
import { DateTime, Interval } from 'luxon';
import { find, forEach } from 'lodash';

function Calendar({ schedules, blockedSchedules, onDayPress }) {
  const weekDays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  const [markedDates, setMarkedDates] = useState({});
  const [nonWorkingDates, setNonWorkingDates] = useState({});

  const [selected, setSelected] = useState();

  const onMonthChange = (month) => {
    if (!schedules) return;
    const date = DateTime.fromMillis(month.timestamp);
    const daysInMonth = date.daysInMonth;
    const nonWorkingTemp = {};

    for (let i = 1; i <= daysInMonth; i++) {
      const day = date.set({ day: i });
      const dayNumber = day.toFormat('E');
      const workingDay = find(schedules, { Day: weekDays[dayNumber - 1] });
      if (!workingDay?.Work) {
        Object.assign(nonWorkingTemp, {
          [day.toFormat('yyyy-MM-dd')]: {
            selected: true,
            disableTouchEvent: true,
            selectedColor: '#434242'
          }
        });
      }
    }

    setNonWorkingDates(nonWorkingTemp);
  };

  const markedDatesWithSelected = useMemo(() => {
    return {
      ...markedDates,
      ...nonWorkingDates,
      [selected]: {
        selected: true,
        disableTouchEvent: true,
        selectedColor: 'white',
        selectedTextColor: '#299eff'
      }
    };
  }, [selected, markedDates, nonWorkingDates]);

  const onDayPressMethod = useCallback((day) => {
    const date = DateTime.fromJSDate(day).toJSDate();
    onDayPress(date);
    setSelected(
      DateTime.fromJSDate(day, { zone: 'utc' }).toFormat('yyyy-MM-dd')
    );
  }, []);

  const { sessions } = useSelector((state) => state.user);

  const getMarkedDates = () => {
    const markedTemp = {};

    sessions?.forEach((session) => {
      const sessionDate = DateTime.fromISO(session.date).toFormat('yyyy-MM-dd');

      if (session.canceled) {
        Object.assign(markedTemp, {
          [sessionDate]: {
            selected: true,
            selectedColor: '#f93f15c1',
            disabled: false
          }
        });
        return;
      }

      if (session.status) {
        Object.assign(markedTemp, {
          [sessionDate]: { selected: true, selectedColor: '#299eff66' }
        });
        return;
      }

      Object.assign(markedTemp, {
        [sessionDate]: { selected: true, selectedColor: '#299eff' }
      });
    });

    forEach(blockedSchedules, (blockedSchedule) => {
      const dates = Interval.fromISO(
        `${blockedSchedule.InitialDate}/${blockedSchedule.EndDate}`
      ).splitBy({ days: 1 });

      forEach(dates, (date) => {
        const formatedDate = DateTime.fromISO(date.s).toFormat('yyyy-MM-dd');

        Object.assign(markedTemp, {
          [formatedDate]: { selected: true, selectedColor: '#d1d1d1' }
        });
      });
    });

    setMarkedDates(markedTemp);
  };

  useEffect(() => {
    getMarkedDates();
  }, [sessions, blockedSchedules]);

  useEffect(() => {
    if (schedules) {
      const timestamp = DateTime.now().toMillis();
      onMonthChange({ timestamp });
    }
  }, [schedules]);

  return (
    <BonumCalendar
      markedDates={markedDatesWithSelected}
      onDayPress={onDayPressMethod}
      onMonthChange={onMonthChange}
    />
  );
}

export default Calendar;
