import axios from 'axios';
import {loadAbort} from './../utilities';
import Config from 'react-native-config';

const alignmentPointSessionUrl = `${Config.SESSIONS_URL}/api/alignmentPointSession`;

const createAlignmentPointSesion = pointSession => {
  console.log(pointSession);
  const controller = loadAbort();
  return {
    call: () =>
      axios.post(alignmentPointSessionUrl, pointSession, {
        signal: controller.signal,
      }),
    controller,
  };
};

const getUserAlignmentPointSesions = user => {
  const controller = loadAbort();
  return {
    call: () =>
      axios.get(`${alignmentPointSessionUrl}/user/${user}`, {
        signal: controller.signal,
      }),
  };
};

const editAlignmentPointSesion = pointSession => {
  console.log(pointSession);
  const controller = loadAbort();
  return {
    call: () =>
      axios.put(
        `${alignmentPointSessionUrl}/${pointSession.id}`,
        pointSession,
        {
          signal: controller.signal,
        },
      ),
    controller,
  };
};

const deleteAlignmentPointSesion = id => {
  const controller = loadAbort();

  return {
    call: () =>
      axios.delete(`${alignmentPointSessionUrl}/${id}`, {
        signal: controller.signal,
      }),
  };
};

export {
  createAlignmentPointSesion,
  getUserAlignmentPointSesions,
  editAlignmentPointSesion,
  deleteAlignmentPointSesion,
};
