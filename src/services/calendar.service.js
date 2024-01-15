import axios from 'axios';
import { map, omit } from 'lodash';
import {
  dateToHour,
  dateToShortDateYearFirst,
  loadAbort
} from './../utilities';
import Config from 'react-native-config';

const calendar_url = Config.CALENDAR_URL;
const nylas = `${calendar_url}/api/calendars/nylas`;
const mongo = `${calendar_url}/api/calendars`;
const eventsNylas = `${calendar_url}/api/events/nylas`;
const blockScheduleURL = `${calendar_url}/api/blockedschedule`;
const workScheduleURL = `${calendar_url}/api/workschedule`;

export const registerCalendar = (email, provider, mobile) => {
  const params = {
    loginHint: email,
    provider,
    mobile
  };

  const controller = loadAbort();

  return {
    call: () =>
      axios.get(`${nylas}/GetURI`, {
        params,
        signal: controller.signal
      }),
    controller
  };
};

export const saveUserToken = (code) => {
  const params = {
    code
  };
  const controller = loadAbort();

  return {
    call: () =>
      axios.get(`${nylas}/SetTokenUser`, { params, signal: controller.signal }),
    controller
  };
};

// export const getNylasCalendars = (accessToken) => {
//   const data = {
//     accessToken
//   }

//   const controller = loadAbort()

//   return {
//     call: () => axios.get()
//   }
// }

export const createBonumCoachingCalendar = (timezone, provider) => {
  let data = {
    name: 'Calendario Bonum',
    description: 'Calendario de Sesiones de Bonum Coaching',
    timezone
  };

  if (
    provider === 'eas' ||
    provider === 'outlook' ||
    provider === 'ews' ||
    provider === 'graph' ||
    provider === 'hotmail' ||
    provider === 'exchange' ||
    provider === 'office365' ||
    provider === 'graph'
  ) {
    data = {
      name: 'Calendario Bonum'
    };
  }

  const controller = loadAbort();

  return {
    call: () => axios.post(`${nylas}`, data, { signal: controller.signal }),
    controller
  };
};

export const createUserCalendar = (calendar, user) => {
  const controller = loadAbort();

  const data = {
    ...calendar,
    email: user?.providers[0]?.email,
    provider: user?.providers[0]?.provider,
    UserId: user?.mongoID
  };

  return {
    call: () => axios.post(`${mongo}/`, data, { signal: controller.signal }),
    controller
  };
};

export const getUserCalendars = (mongoID) => {
  const data = {
    user: { _id: mongoID }
  };

  const controller = loadAbort();

  return {
    call: () =>
      axios.get(`${mongo}/byuser`, { signal: controller.signal, params: data }),
    controller
  };
};

export const updateUserCalendars = (calendars) => {
  const controller = loadAbort();

  return {
    call: () =>
      axios.put(`${mongo}/`, calendars, { signal: controller.signal }),
    controller
  };
};

const setByTimezone = (time) => {
  const date = new Date();
  const difference = -date.getTimezoneOffset() / 60;

  const newDate = time.setHours(time.getHours() + difference);

  return new Date(newDate);
};

export const blockSchedule = (schedule, UserId, timezone) => {
  const data = {
    InitialDate: `${dateToShortDateYearFirst(schedule.fromDate)} ${
      schedule.fromTime
    }`,

    EndDate: `${dateToShortDateYearFirst(schedule.toDate)} ${schedule.toTime}`,
    UserId,
    timezone
  };

  const controller = loadAbort();
  return {
    call: () =>
      axios.post(`${blockScheduleURL}/`, data, { signal: controller.signal }),
    controller
  };
};

export const getUserBlockSchedule = (userid = null) => {
  const params = {
    userid
  };

  const controller = loadAbort();

  return {
    call: () =>
      axios.get(`${blockScheduleURL}/GetByUser`, {
        signal: controller.signal,
        params
      }),
    controller
  };
};

export const getUserWorkingHours = (userid) => {
  const params = {
    userid
  };
  const controller = loadAbort();

  return {
    call: () =>
      axios.get(`${workScheduleURL}/GetByUser`, {
        signal: controller.signal,
        params
      }),
    controller
  };
};

export const saveUserWorkingHours = (workingHours) => {
  const controller = loadAbort();

  const data = map(workingHours, (workingHour) => omit(workingHour, ['id']));

  return {
    call: () =>
      axios.post(`${workScheduleURL}/`, data, {
        signal: controller.signal
      }),
    controller
  };
};

export const createEventOnCoachCalendar = (event) => {
  const controller = loadAbort();

  return {
    call: () =>
      axios.post(`${eventsNylas}/`, event, { signal: controller.signal }),
    controller
  };
};

export const getCoachAvailability = (date, coachID) => {
  const params = {
    date,
    userid: coachID
  };
  const controller = loadAbort();

  return {
    call: () =>
      axios.get(`${mongo}/availability`, { signal: controller.signal, params }),
    controller
  };
};

export const deleteBlockedSchedule = (schedule) => {
  const controller = loadAbort();

  return {
    call: () =>
      axios.delete(`${blockScheduleURL}/`, {
        signal: controller.signal,
        params: schedule
      }),
    controller
  };
};
