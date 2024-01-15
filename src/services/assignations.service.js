import axios from 'axios';
import { loadAbort } from './../utilities';
import Config from 'react-native-config';

const assignmentsURL = `${Config.SESSIONS_URL}/api/assignment`;

console.log('url', Config.SESSIONS_URL);

const createAssignation = (assignation) => {
  const controller = loadAbort();
  return {
    call: () =>
      axios.post(assignmentsURL, assignation, {
        signal: controller.signal
      }),
    controller
  };
};

const getUserAssignations = (user) => {
  const controller = loadAbort();
  return {
    call: () =>
      axios.get(`${assignmentsURL}/user/${user}`, { signal: controller.signal })
  };
};

const editAssignation = (assignation) => {
  const controller = loadAbort();
  return {
    call: () =>
      axios.put(`${assignmentsURL}/${assignation.id}`, assignation, {
        signal: controller.signal
      }),
    controller
  };
};

const deleteAssignation = (id) => {
  const controller = loadAbort();

  return {
    call: () =>
      axios.delete(`${assignmentsURL}/${id}`, { signal: controller.signal })
  };
};

export {
  createAssignation,
  getUserAssignations,
  editAssignation,
  deleteAssignation
};
