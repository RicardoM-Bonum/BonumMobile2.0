import axios from 'axios';
import {loadAbort} from './../utilities';
import Config from 'react-native-config';

const sessionsURL = `${Config.SESSIONS_URL}/api/session`;

export const createSession = data => {
  const controller = loadAbort();
  return {
    call: () => axios.post(sessionsURL, data, {signal: controller.signal}),
    controller,
  };
};

export const EndSession = data => {
  const controller = loadAbort();

  return {
    call: () =>
      axios.put(`${sessionsURL}/EndSession/${data._id || data.id}`, data, {
        signal: controller.signal,
      }),
    controller,
  };
};

export const updateSession = data => {
  const controller = loadAbort();

  return {
    call: () =>
      axios.put(`${sessionsURL}/${data._id || data.id}`, data, {
        signal: controller.signal,
      }),
    controller,
  };
};

export const AlternalCall = data => {
  const controller = loadAbort();

  return {
    call: () =>
      axios.patch(`${sessionsURL}/AlternalCall`, data, {
        signal: controller.signal,
      }),
    controller,
  };
};

export const getCoachSessions = coach => {
  const controller = loadAbort();

  return {
    call: () =>
      axios.get(`${sessionsURL}/coach/${coach}`, {signal: controller.signal}),
    controller,
  };
};

export const getCoacheeSessions = coachee => {
  const controller = loadAbort();
  return {
    call: () =>
      axios.get(`${sessionsURL}/coachee/${coachee}`, {
        signal: controller.signal,
      }),
    controller,
  };
};

export const getSessionByID = id => {
  const controller = loadAbort();

  return {
    call: () => axios.get(`${sessionsURL}/${id}`),
    controller,
  };
};

export const cancelSessionByCoach = data => {
  const controller = loadAbort();

  return {
    call: () =>
      axios.put(`${sessionsURL}/coach/cancel/${data._id}`, data, {
        signal: controller.signal,
      }),
    controller,
  };
};

export const cancelSession = data => {
  const controller = loadAbort();

  return {
    call: () =>
      axios.put(`${sessionsURL}/cancel/${data.id}`, data, {
        signal: controller.signal,
      }),
    controller,
  };
};

export const rescheduleSession = data => {
  const controller = loadAbort();

  return {
    call: () =>
      axios.put(`${sessionsURL}/reschedule/${data._id || data.id}`, data, {
        signal: controller.signal,
      }),
    controller,
  };
};

export const updateSessionNumber = ({coacheeId, id}) => {
  const controller = loadAbort();

  return {
    call: () =>
      axios.put(`${sessionsURL}/updateSessionNumber/${id}/${coacheeId}`, {
        signal: controller.signal,
      }),
    controller,
  };
};

export const resetSessionNumber = ({id}) => {
  const controller = loadAbort();

  return {
    call: () =>
      axios.put(`${sessionsURL}/resetSessionNumber/${id}`, {
        signal: controller.signal,
      }),
    controller,
  };
};
