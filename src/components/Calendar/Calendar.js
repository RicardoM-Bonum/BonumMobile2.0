import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import tw from 'twrnc';

function BonumCalendar(props) {
  const {
    minDate,
    markedDates,
    onDayPress = () => null,
    selected,
    onMonthChange
  } = props;

  const { t, i18n } = useTranslation('global');

  // Define los nombres de los meses y días utilizando la función t() para traducirlos
  const monthNames = [
    t('lastTranslations.calendar.monthName.January'),
    t('lastTranslations.calendar.monthName.February'),
    t('lastTranslations.calendar.monthName.March'),
    t('lastTranslations.calendar.monthName.April'),
    t('lastTranslations.calendar.monthName.May'),
    t('lastTranslations.calendar.monthName.June'),
    t('lastTranslations.calendar.monthName.July'),
    t('lastTranslations.calendar.monthName.August'),
    t('lastTranslations.calendar.monthName.September'),
    t('lastTranslations.calendar.monthName.October'),
    t('lastTranslations.calendar.monthName.November'),
    t('lastTranslations.calendar.monthName.December')
  ];

  const monthNamesShort = [
    t('lastTranslations.calendar.monthShortName.Jan'),
    t('lastTranslations.calendar.monthShortName.Feb'),
    t('lastTranslations.calendar.monthShortName.Mar'),
    t('lastTranslations.calendar.monthShortName.Apr'),
    t('lastTranslations.calendar.monthShortName.May'),
    t('lastTranslations.calendar.monthShortName.Jun'),
    t('lastTranslations.calendar.monthShortName.Jul'),
    t('lastTranslations.calendar.monthShortName.Aug'),
    t('lastTranslations.calendar.monthShortName.Sep'),
    t('lastTranslations.calendar.monthShortName.Oct'),
    t('lastTranslations.calendar.monthShortName.Nov'),
    t('lastTranslations.calendar.monthShortName.Dec')
  ];

  const dayNames = [
    t('lastTranslations.calendar.dayName.Sunday'),
    t('lastTranslations.calendar.dayName.Monday'),
    t('lastTranslations.calendar.dayName.Tuesday'),
    t('lastTranslations.calendar.dayName.Wednesday'),
    t('lastTranslations.calendar.dayName.Thursday'),
    t('lastTranslations.calendar.dayName.Friday'),
    t('lastTranslations.calendar.dayName.Saturday')
  ];

  const dayNamesShort = [
    t('lastTranslations.calendar.dayShortName.Sun'),
    t('lastTranslations.calendar.dayShortName.Mon'),
    t('lastTranslations.calendar.dayShortName.Tue'),
    t('lastTranslations.calendar.dayShortName.Wed'),
    t('lastTranslations.calendar.dayShortName.Thu'),
    t('lastTranslations.calendar.dayShortName.Fri'),
    t('lastTranslations.calendar.dayShortName.Sat')
  ];

  LocaleConfig.locales[i18n.language] = {
    monthNames: monthNames,
    monthNamesShort: monthNamesShort,
    dayNames: dayNames,
    dayNamesShort: dayNamesShort,
    today: 'Hoy'
  };

  LocaleConfig.defaultLocale = i18n.language;

  useEffect(() => {}, [minDate]);

  return (
    <Calendar
      enableSwipeMonths
      minDate={minDate}
      onDayPress={({ timestamp }) => onDayPress(new Date(timestamp))}
      onMonthChange={onMonthChange}
      markedDates={markedDates}
      hideExtraDays
      style={tw.style('rounded-3xl shadow-md pb-4')}
      disableAllTouchEventsForDisabledDays
      allowSelectionOutOfRange
    />
  );
}

export default BonumCalendar;
