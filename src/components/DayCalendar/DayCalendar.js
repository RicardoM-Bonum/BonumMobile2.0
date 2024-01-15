import React from 'react';
import { useEffect, useState } from 'react';
import { Calendar, CalendarUtils } from 'react-native-calendars';
import { DateTime, Settings } from 'luxon';
import { map } from 'lodash';
import { useSelector } from 'react-redux';
import EventWrapper from './components/EventWrapper';
import { useTranslation } from 'react-i18next';
import tw from 'twrnc';

function DayCalendar({ date, sessions, isCoach }) {
  //const { selectedDate } = useContext(CoachCalendarContext);
  const [events, setEvents] = useState([]);
  const { timezone } = useSelector((state) => state.user);
  Settings.defaultZone = timezone;
  // const localizer = luxonLocalizer(DateTime);
  const { t } = useTranslation('global');

  const formats = {
    timeGutterFormat: (date, culture, localizer) =>
      localizer.format(date, 'hh:mm a', culture),
    eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
      `${localizer.format(start, 'hh:mm a')} - ${localizer.format(
        end,
        'hh:mm a'
      )}`,
    agendaTimeRangeFormat: ({ start, end }, culture, localizer) =>
      `${localizer.format(start, 'hh:mm a')} a ${localizer.format(
        end,
        'hh:mm a'
      )}`,

    agendaDateFormat: (date, culture, localizer) =>
      localizer.format(date, 'EEE dd MMM', culture)
  };

  const getEvents = () => {
    setEvents(
      map(sessions, (session) => {
        if (
          DateTime.fromJSDate(date).toISODate() ===
          DateTime.fromISO(session.date).toISODate()
        ) {
          if (isCoach) {
            const { coachee } = session;
            return {
              title: t('components.dayCalendar.title', {
                name: coachee?.name,
                lastname: coachee?.lastname
              }),
              start: DateTime.fromISO(session.date, {
                zone: timezone,
                setZone: true
              }).toJSDate(),
              end: DateTime.fromISO(session.date, {
                zone: timezone,
                setZone: true
              })
                .plus({ hours: 1 })
                .toJSDate(),
              isExecuted: session.status
            };
          }

          const { coach } = session;
          return {
            title: t('components.dayCalendar.title', {
              name: coach?.name,
              lastname: coach?.lastname
            }),
            start: DateTime.fromISO(session.date, {
              zone: timezone,
              setZone: true
            }).toJSDate(),
            end: DateTime.fromISO(session.date, {
              zone: timezone,
              setZone: true
            })
              .plus({ hours: 1 })
              .toJSDate(),
            isExecuted: session.status
          };
        }
      })
    );
  };

  useEffect(() => {
    getEvents();
  }, [date]);

  return (
    <Calendar
      enableSwipeMonths
      // minDate={minDate}
      // onDayPress={({ timestamp }) => onDayPress(new Date(timestamp))}
      // onMonthChange={onMonthChange}
      // markedDates={events}
      hideExtraDays
      style={tw.style('rounded-3xl shadow-md pb-4')}
    />
  );
}

export default DayCalendar;
