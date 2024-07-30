import axios from 'axios';
import {loadAbort} from './../utilities';
import Config from 'react-native-config';

interface IMidNPS {
  coachee: string;
  recomendation: number;
  usefulAspect: string;
  obstacles: string;
}

interface IFinalNPS {
  coachee: string;
  recomendation: number;
  coachValoration: number;
  feelingsAboutCareer: string;
  feelingsAboutBonum: string;
  programFeedback: string;
}

const midNps = `${Config.USERS_URL}/api/midnps`;
const finalNps = `${Config.USERS_URL}/api/finalnps`;

export const createMidNPS = (data: IMidNPS) => {
  const controller = loadAbort();

  return {
    call: () =>
      axios.post(midNps, data, {
        signal: controller.signal,
      }),
    controller,
  };
};

export const createFinalNps = (data: IFinalNPS) => {
  const controller = loadAbort();

  return {
    call: () =>
      axios.post(finalNps, data, {
        signal: controller.signal,
      }),
    controller,
  };
};
