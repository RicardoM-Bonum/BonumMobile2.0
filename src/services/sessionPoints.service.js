import axios from 'axios';
import { loadAbort } from './../utilities';
import Config from 'react-native-config';

const pointSessionURL = `${Config.SESSIONS_URL}/api/pointSession`;

const createPointSesion = (pointSession) => {
  const controller = loadAbort();
  return {
    call: () =>
      axios.post(pointSessionURL, pointSession, {
        signal: controller.signal
      }),
    controller
  };
};

const getUserPointSesions = (user) => {
  const controller = loadAbort();
  return {
    call: () =>
      axios.get(`${pointSessionURL}/user/${user}`, {
        signal: controller.signal
      })
  };
};

const editPointSesion = (pointSession) => {
  const controller = loadAbort();
  return {
    call: () =>
      axios.put(`${pointSessionURL}/${pointSession.id}`, pointSession, {
        signal: controller.signal
      }),
    controller
  };
};

const deletePointSesion = (id) => {
  const controller = loadAbort();

  return {
    call: () =>
      axios.delete(`${pointSessionURL}/${id}`, { signal: controller.signal })
  };
};

export {
  createPointSesion,
  getUserPointSesions,
  editPointSesion,
  deletePointSesion
};
