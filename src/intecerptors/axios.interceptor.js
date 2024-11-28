import axios from 'axios';
import auth from '@react-native-firebase/auth';
import store from '../redux/store';

const updateRequestWithFirebaseToken = async request => {
  try {
    if (request?.url.includes('sendResetPasswordLink')) return request;
    const {token} = await auth().currentUser.getIdTokenResult();
    request.headers = {
      ...request.headers,
      Authorization: `Bearer ${token}`,
    };

    return request;
  } catch (error) {
    console.log({error});
  }
};

const updateRequestWithCalendarTokens = async request => {
  const {token} = await auth().currentUser.getIdTokenResult();
  const {user} = store.getState();
  const nylasProviderToken = user?.providers[0]?.accessToken;

  request.headers = {
    ...request.headers,
    Authorization: `Bearer ${token}`,
    accessToken: nylasProviderToken,
  };

  return request;
};

const updateRequestOnCreateEvent = async request => {
  if (request.method === 'get') {
    return request;
  }

  const {token} = await auth().currentUser.getIdTokenResult();
  const {user} = store.getState();
  let nylasProviderToken = user?.providers[0]?.accessToken;
  if (user.role === 'coachee') {
    nylasProviderToken = user?.coach?.providers[0]?.accessToken;
  }

  request.headers = {
    ...request.headers,
    Authorization: `Bearer ${token}`,
    accessToken: nylasProviderToken,
  };

  return request;
};

axios.interceptors.request.use(request => {
  if (request.url?.includes('userRol')) {
    return updateRequestWithFirebaseToken(request);
  }

  if (
    request.url?.includes('calendars/') ||
    request.url?.includes('workschedule') ||
    request.url?.includes('blockedschedule')
  ) {
    return updateRequestWithCalendarTokens(request);
  }

  if (
    request.url?.includes('/events/nylas') ||
    request.url?.includes('/session')
  ) {
    return updateRequestOnCreateEvent(request);
  }

  return request;
});
