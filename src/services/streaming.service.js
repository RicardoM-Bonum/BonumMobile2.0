import axios from 'axios';
import { loadAbort } from '../utilities';
import Config from 'react-native-config';

const sessionsURL = `${Config.STREAMING_URL}/api/meeting`;

export const updateStreaming = (data) => {
  const controller = loadAbort();

  return {
    call: () =>
      axios.put(`${sessionsURL}/${data._id}`, data, {
        signal: controller.signal
      }),
    controller
  };
};
