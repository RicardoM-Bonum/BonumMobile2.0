import axios from 'axios';
import { loadAbort } from './../utilities';
import Config from 'react-native-config';

const coacheeUrl = `${Config.USERS_URL}/api/coachee`;

export const updateEvaluationCoachee = (user, data) => {
  const controller = loadAbort();

  return {
    call: () =>
      axios.put(`${coacheeUrl}/${user}`, data, {
        signal: controller.signal
      }),
    controller
  };
};

export const updateCoacheeOnboarding = (onboarding, user) => {
  const controller = loadAbort();
  const { name, lastname } = onboarding.createYourAccount;
  const evaluation = onboarding.evaluation;

  const coacheeEvaluators = [
    ...evaluation.colaborators,
    ...evaluation.supervisors,
    ...evaluation.partners
  ];

  const data = {
    firebaseUID: user.uid,
    urlImgCoachee: onboarding.photo,
    name,
    lastname,
    focusAreas: onboarding.focusAreas.map((focusArea) => focusArea.id),
    evaluators: coacheeEvaluators,
    coach: user.coach._id,
    timezone: onboarding.timezone,
    languages: onboarding.languages
  };

  return {
    call: () =>
      axios.put(`${coacheeUrl}/onboarding/${user.uid}`, data, {
        signal: controller.signal
      }),
    controller
  };
};

export const updateCoachee = (data) => {
  const controller = loadAbort();

  return {
    call: () =>
      axios.put(
        `${coacheeUrl}/${data.id}`,
        { ...data },
        { signal: controller.signal }
      ),
    controller
  };
};

export const getCoacheeBySearch = (search, coach) => {
  const controller = loadAbort();

  return {
    call: () =>
      axios.get(`${coacheeUrl}/coach`, {
        params: {
          searchText: search,
          coach: coach
        },
        signal: controller.signal
      }),
    controller
  };
};
