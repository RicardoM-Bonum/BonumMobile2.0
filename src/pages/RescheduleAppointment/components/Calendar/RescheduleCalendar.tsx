import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { DateTime, Interval } from 'luxon';
import BonumCalendar from '../../../../components/Calendar/Calendar';
import { find } from 'lodash';

function RescheduleCalendar({
  schedules,
  onDayPress,
  minDate,
  sessionToReschedule
}) {
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
  const [selected, setSelected] = useState('');
  const calendarFormat = 'yyyy-MM-dd';
  const sessionToRescheduleDate = DateTime.fromISO(
    sessionToReschedule.date
  ).toFormat(calendarFormat);

  const onMonthChange = (month) => {
    if (!schedules) return;
    const date = DateTime.fromMillis(month.timestamp);
    const daysInMonth = date.daysInMonth;
    const nonWorkingTemp = {};

    for (let i = 1; i <= daysInMonth; i++) {
      const day = date.set({ day: i });
      const dayNumber: number = Number(day.toFormat('E'));
      const workingDay = find(schedules, { Day: weekDays[dayNumber - 1] });
      if (!workingDay?.Work) {
        Object.assign(nonWorkingTemp, {
          [day.toFormat(calendarFormat)]: {
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
        selectedTextColor: '#299eff66'
      }
    };
  }, [selected, markedDates, nonWorkingDates]);

  const onDayPressMethod = useCallback((day) => {
    const date = DateTime.fromJSDate(day).toJSDate();
    onDayPress(date);
    setSelected(
      DateTime.fromJSDate(day, { zone: 'utc' }).toFormat(calendarFormat)
    );
  }, []);

  const { sessions } = useSelector((state: any) => state.user);

  const getMarkedDates = () => {
    const markedTemp = {};
    const today = DateTime.now().toFormat(calendarFormat);

    sessions?.forEach(async (session) => {
      const sessionDate = DateTime.fromISO(session.date).toFormat(
        calendarFormat
      );
      let disabled = true;

      if (sessionDate === sessionToRescheduleDate) {
        disabled = false;
      }

      const beforeInterval = Interval.before(
        DateTime.fromISO(session.date).minus({ days: 5 }),
        {
          days: 5
        }
      ).splitBy({ days: 1 });

      const afterInterval = Interval.after(DateTime.fromISO(session.date), {
        days: 5
      }).splitBy({ days: 1 });

      await new Promise((resolve, reject) => {
        beforeInterval.forEach((date) => {
          const intervalDate: any = date.start
            ?.toFormat(calendarFormat)
            .toString();

          if (sessionDate === intervalDate || intervalDate < today) return;
          if (sessionToRescheduleDate === sessionDate) return;
          Object.assign(markedTemp, {
            [intervalDate]: {
              disabled: false
            }
          });
        });

        resolve(true);
      });

      await new Promise((resolve, reject) => {
        afterInterval.forEach((date) => {
          const intervalDate: any = date.start
            ?.toFormat(calendarFormat)
            .toString();

          if (sessionDate === intervalDate) return;
          if (sessionDate === sessionToRescheduleDate) return;
          if (intervalDate === sessionToRescheduleDate) return;
          if (intervalDate < today) return;

          Object.assign(markedTemp, {
            [intervalDate]: {
              disabled: true
            }
          });
        });

        resolve(true);
      });

      if (session.canceled) {
        Object.assign(markedTemp, {
          [sessionDate]: {
            selected: true,
            selectedColor: '#f93f15c1',
            disabled
          }
        });
        return;
      }

      if (session.status) {
        Object.assign(markedTemp, {
          [sessionDate]: {
            selected: true,
            selectedColor: '#299eff66',
            disabled
          }
        });
        return;
      }

      Object.assign(markedTemp, {
        [sessionDate]: {
          selected: true,
          selectedColor: '#299eff',
          disabled
        }
      });
    });

    setMarkedDates(markedTemp);
  };

  useEffect(() => {
    getMarkedDates();
  }, [sessions, sessionToReschedule]);

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
      minDate={minDate}
      sessions={sessions}
    />
  );
}

export default RescheduleCalendar;
