import axios from 'axios';
import {loadAbort} from './../utilities';
import QueryString from 'qs';
import Config from 'react-native-config';

const coachUrl = `${Config.USERS_URL}/api/coach`;

export const getUser = id => {
  const controller = loadAbort();

  return {
    call: () =>
      axios.get(`${coachUrl}/userRol/${id}`, {
        signal: controller.signal,
      }),
    controller,
  };
};

export const updateCoachOnboarding = (onboarding, user) => {
  const controller = loadAbort();
  const {name, lastname} = onboarding.createYourAccount;
  const {work, resume} = onboarding.aboutYouCoach;

  const focusAreasIds = onboarding.focusAreas.map(focusArea => ({
    _id: focusArea.id,
  }));

  const data = {
    urlImgCoach: onboarding.photo,
    name,
    lastname,
    focusAreas: focusAreasIds,
    howWork: work,
    resume,
    urlVideoCoach: onboarding.video,
    timezone: onboarding.timezone,
    languages: onboarding.languages,
  };

  return {
    call: () =>
      axios.put(`${coachUrl}/onboarding/${user.uid}`, data, {
        signal: controller.signal,
      }),
    controller,
  };
};

export const getCoachesByFocusAreas = (focusAreas, languages, coacheeId) => {
  const controller = loadAbort();
  return {
    call: () =>
      axios.get(`${coachUrl}/focusAreas`, {
        params: {
          focusAreas: focusAreas.map(focusArea => focusArea.id),
          languages,
          coacheeId,
        },
        paramsSerializer: params => {
          return QueryString.stringify(params, {arrayFormat: 'brackets'});
        },
        signal: controller.signal,
      }),
    controller,
  };
};

export const getCoachBySearch = search => {
  const controller = loadAbort();

  return {
    call: () =>
      axios.get(coachUrl, {
        params: {
          searchText: search,
        },
        signal: controller.signal,
      }),
    controller,
  };
};

export const getById = id => {
  const controller = loadAbort();
  return {
    call: () => axios.get(`${coachUrl}/${id}`, {signal: controller.signal}),
    controller,
  };
};

export const updateCoach = data => {
  const controller = loadAbort();

  return {
    call: () =>
      axios.put(
        `${coachUrl}/${data.id}`,
        {...data},
        {signal: controller.signal},
      ),
    controller,
  };
};

export const updateEvaluationCoach = (user, data) => {
  const controller = loadAbort();

  return {
    call: () =>
      axios.put(`${coachUrl}/${user}`, data, {
        signal: controller.signal,
      }),
    controller,
  };
};

export const translateText = data => {
  const controller = loadAbort();

  const {targetLanguage, text} = data;

  return {
    call: () =>
      axios.put(
        `${coachUrl}/languages/translate`,
        {
          targetLanguage: targetLanguage,
          text: text,
        },
        {
          signal: controller.signal,
        },
      ),
    controller,
  };
};
export const updateCoachEventsCalendar = data => {
  const controller = loadAbort();

  return {
    call: () =>
      axios.put(`${coachUrl}/updateEventsCalendar/${data.coach}`, data, {
        signal: controller.signal,
      }),
    controller,
  };
};
