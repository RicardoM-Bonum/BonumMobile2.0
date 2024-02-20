import axios from 'axios';
import {loadAbort} from './../utilities';
import Config from 'react-native-config';

const programUrl = `${Config.USERS_URL}/api/program`;

export const getProgramById = id => {
  const controller = loadAbort();

  return {
    call: () =>
      axios.get(`${programUrl}/${id}`, {
        signal: controller.signal,
      }),
    controller,
  };
};
