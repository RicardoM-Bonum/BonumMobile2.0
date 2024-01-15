import { configureStore } from '@reduxjs/toolkit';
import onboardingReducer from './slices/onboarding';
import userReducer from './slices/user';
import sessionReducer from './slices/session';
import meetingReducer from './slices/meeting';

export default configureStore({
  reducer: {
    onboarding: onboardingReducer,
    user: userReducer,
    session: sessionReducer,
    meeting: meetingReducer
  }
});
