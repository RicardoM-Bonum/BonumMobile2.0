import axios from 'axios';
import {loadAbort} from 'utilities';

const route = `${process.env.REACT_APP_USERS_URL}/api/program`;

export const getProgramById = id => {
  console.log('route', route);
  const controller = loadAbort();
  return {
    call: () => axios.get(`${route}/${id}`, {signal: controller.signal}),
    controller,
  };
};
