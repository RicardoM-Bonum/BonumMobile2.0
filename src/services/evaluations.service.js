import axios from 'axios';
import { loadAbort } from './../utilities';
import Config from 'react-native-config';

const baseUrl = `${Config.EVALUATIONS_URL}/api/`;
const autoEvaluationsUrl = baseUrl + 'autoevaluation';
const evaluation360Url = baseUrl + 'evaluation360';

export const getAutoEvaluationById = (id) => {
  const controller = loadAbort();

  return {
    call: () =>
      axios.get(`${autoEvaluationsUrl}/${id}`, { signal: controller.signal }),
    controller
  };
};

export const updateAutoEvaluationAnswers = (data) => {
  const controller = loadAbort();

  return {
    call: () =>
      axios.post(`${autoEvaluationsUrl}/completed`, data, {
        signal: controller.signal
      }),
    controller
  };
};

export const getAutoEvaluationByCoacheeId = (id) => {
  const controller = loadAbort();

  return {
    call: () =>
      axios.get(`${autoEvaluationsUrl}/coachee/${id}`, {
        signal: controller.signal
      }),
    controller
  };
};

export const getEvaluation360ByCoacheeId = (id) => {
  const controller = loadAbort();

  return {
    call: () =>
      axios.get(`${evaluation360Url}/coachee/${id}`, {
        signal: controller.signal
      }),
    controller
  };
};

export const getEvaluation360ById = (id) => {
  const controller = loadAbort();

  return {
    call: () =>
      axios.get(`${evaluation360Url}/${id}`, { signal: controller.signal }),
    controller
  };
};

export const updateEvaluation360Answers = (data) => {
  const controller = loadAbort();

  return {
    call: () =>
      axios.post(`${evaluation360Url}/completed`, data, {
        signal: controller.signal
      }),
    controller
  };
};
