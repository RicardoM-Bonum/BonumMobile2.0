import i18next from 'i18next';
import {DateTime} from 'luxon';
import {useStore} from 'react-redux';

const dateToLongDate = unformatedDate => {
  const formatedDate = DateTime.fromJSDate(unformatedDate, {zone: 'utc'});
  return formatedDate.toLocaleString(DateTime.DATE_FULL, {locale: 'es'});
};

const mongoDateToLongDate = unformatedDate => {
  const store = useStore();
  const {user} = store.getState();
  const formatedDate = DateTime.fromISO(unformatedDate);
  return formatedDate
    .setZone(user.timezone)
    .toLocaleString(DateTime.DATE_FULL, {locale: i18next.language});
};

const mongoDateToShortDate = unformatedDate => {
  const store = useStore();
  const {user} = store.getState();
  const formatedDate = DateTime.fromISO(unformatedDate, {zone: user.timezone});
  return formatedDate.toFormat('dd-MM-yyyy', {locale: 'es'});
};
const mongoDateToShortDateYearFirst = unformatedDate => {
  const store = useStore();
  const {user} = store.getState();
  const formatedDate = DateTime.fromISO(unformatedDate, {zone: user.timezone});
  return formatedDate.toFormat('yyyy-MM-dd');
};
const dateToShortDateYearFirst = unformatedDate => {
  const formatedDate = DateTime.fromJSDate(unformatedDate, {zone: 'utc'});
  return formatedDate.toFormat('yyyy-MM-dd');
};

const mongoDateToTime = unformatedDate => {
  const store = useStore();
  const {user} = store.getState();
  const formatedDate = DateTime.fromISO(unformatedDate, {zone: user.timezone});
  return formatedDate.toFormat('hh:mma');
};
const jsDateToTimeISO = unformatedDate => {
  const formatedDate = DateTime.fromJSDate(unformatedDate, {zone: 'utc'});
  return formatedDate.toISO('hh:mma');
};

const dateToHour = unformatedDate => {
  const formatedDate = DateTime.fromJSDate(unformatedDate, {zone: 'utc'});
  return formatedDate.toFormat('HH:mm');
};
const mongoDateToHour = unformatedDate => {
  const store = useStore();
  const {user} = store.getState();
  const formatedDate = DateTime.fromISO(unformatedDate, {zone: user.timezone});
  return formatedDate.toFormat('HH:mm');
};

const mongoDateToTimePlusOneHour = unformatedDate => {
  const store = useStore();
  const {user} = store.getState();
  const formatedDate = DateTime.fromISO(unformatedDate, {
    zone: user.timezone,
  }).plus({hours: 1});
  return formatedDate.toFormat('hh:mma');
};

const mongoDateToLongDateWithTime = ({unformatedDate, language}) => {
  const store = useStore();
  const {user} = store.getState();
  const formatedDate = DateTime.fromISO(unformatedDate, {
    zone: user.timezone,
  });
  return formatedDate.toFormat('DDDD hh:mm a', {locale: language});
};

const mongoDateToSessionDate = unformatedDate => {
  const store = useStore();
  const {user} = store.getState();
  const formatedDate = DateTime.fromISO(unformatedDate, {
    zone: user.timezone,
  });
  return formatedDate.toFormat('DDD hh:mm a', {locale: 'es'});
};

export {
  dateToLongDate,
  mongoDateToLongDate,
  mongoDateToShortDate,
  mongoDateToTime,
  mongoDateToTimePlusOneHour,
  mongoDateToLongDateWithTime,
  mongoDateToShortDateYearFirst,
  mongoDateToHour,
  dateToShortDateYearFirst,
  jsDateToTimeISO,
  dateToHour,
  mongoDateToSessionDate,
};
