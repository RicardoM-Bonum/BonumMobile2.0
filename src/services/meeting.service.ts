import axios from 'axios';
import Config from 'react-native-config';
import { loadAbort } from '../utilities';

const route = `${Config.STREAMING_URL}/api/meeting`;

export const post = (data) => {
  const controller = loadAbort();
  return {
    call: () => axios.post(route, { ...data }, { signal: controller.signal }),
    controller
  };
};

export const getAll = () => {
  const controller = loadAbort();
  return {
    call: () => axios.get(route, { signal: controller.signal }),
    controller
  };
};

export const getById = (id: string) => {
  const controller = loadAbort();
  return {
    call: () => axios.get(`${route}/${id}`, { signal: controller.signal }),
    controller
  };
};

export const remove = (id: string) => {
  const controller = loadAbort();
  return {
    call: () => axios.delete(`${route}/${id}`, { signal: controller.signal }),
    controller
  };
};

export const put = (id, data) => {
  const controller = loadAbort();
  return {
    call: () =>
      axios.put(`${route}/${id}`, { ...data }, { signal: controller.signal }),
    controller
  };
};

export const UpdateMeeting = (id, data) => {
  const controller = loadAbort();
  return {
    call: () =>
      axios.put(
        `${route}/updateMeeting/${id}`,
        { ...data },
        { signal: controller.signal }
      ),
    controller
  };
};

export default {
  post,
  remove,
  put,
  UpdateMeeting
};
