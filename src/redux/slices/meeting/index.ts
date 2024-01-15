import { createSlice } from '@reduxjs/toolkit';

const meeting = {};

export const meetingSlice = createSlice({
  name: 'meeting',
  initialState: meeting,
  reducers: {
    modifyMeeting: (state, action) => ({
      ...state,
      ...action.payload
    }),
    resetMeeting: () => meeting
  }
});

export const { modifyMeeting, resetMeeting } = meetingSlice.actions;

export default meetingSlice.reducer;
