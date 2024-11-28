import axios from 'axios';
import Config from 'react-native-config';
import {loadAbort} from '../utilities';

const usersURL = `${Config.USERS_URL}/api`;

console.log('Config', usersURL);

export const getUser = id => {
  const controller = loadAbort();
  return {
    call: () =>
      axios.get(`${usersURL}/userRol/${id}`, {
        signal: controller.signal,
      }),
    controller,
  };
};

export const updateUserCalendar = (user, data) => {
  const controller = loadAbort();
  const calendar = data.data;

  let url = `${usersURL}/coachee`;
  if (user.role === 'coach') {
    url = `${usersURL}/coach`;
  }

  return {
    call: () =>
      axios.put(
        `${url}/${user.mongoID}`,
        {calendar},
        {
          signal: controller.signal,
        },
      ),
  };
};

export const updateUserLanguagesAndTimezone = (user, role, data) => {
  const controller = loadAbort();

  return {
    call: () =>
      axios.put(`${usersURL}/${role}/languages/${user}`, data, {
        signal: controller.signal,
      }),
  };
};

export const updateCoachee = (id, data) => {
  const controller = loadAbort();

  return {
    call: () =>
      axios.put(`${usersURL}/coachee/noShow/${id}`, data, {
        signal: controller.signal,
      }),
    controller,
  };
};

export const updateNoShowAcc = (id, data) => {
  const controller = loadAbort();

  return {
    call: () =>
      axios.put(`${usersURL}/coachee/noShowAcc/${id}`, data, {
        signal: controller.signal,
      }),
    controller,
  };
};

export const sendChatMessage = data => {
  const controller = loadAbort();

  return {
    call: () =>
      axios.post(`${usersURL}/userRol/sendChatNotification`, data, {
        signal: controller.signal,
      }),
    controller,
  };
};

export const resetPassword = email => {
  const controller = loadAbort();

  return {
    call: () =>
      axios.post(
        `${usersURL}/userRol/sendResetPasswordLink`,
        {email},
        {
          signal: controller.signal,
        },
      ),
    controller,
  };
};
