import axios from 'axios';
import { loadAbort } from './../utilities';
import Config from 'react-native-config';

const route = `${Config.USERS_URL}/api/focusAreas`;

export const getFocusAreas = () => {
  const controller = loadAbort();
  return {
    call: () => axios.get(route, { signal: controller.signal }),
    controller
  };
};
