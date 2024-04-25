import {createSlice} from '@reduxjs/toolkit';

const user = {
  name: '',
  role: '',
  coach: null,
  uid: '',
  userLoading: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState: user,
  reducers: {
    setCoach: (state, action) => ({
      ...state,
      coach: action.payload,
    }),
    modifyUser: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    resetUser: () => user,
    modifySessions: (state, action) => ({
      ...state,
      sessions: action.payload,
    }),
    setLoadingUser: (state, action) => ({
      ...state,
      userLoading: action.payload,
    }),
    modifyUserEventCalendar: (state, action) => ({
      ...state,
      calendar: action.payload,
    }),
  },
});

export const {
  setCoach,
  modifyUser,
  resetUser,
  modifySessions,
  setLoadingUser,
  modifyUserEventCalendar,
} = userSlice.actions;

export default userSlice.reducer;
