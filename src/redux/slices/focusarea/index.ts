import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isRendered: false,
};

export const focusAreaSlice = createSlice({
  name: 'focusArea',
  initialState,
  reducers: {
    setRender: (state, action) => {
      state.isRendered = action.payload;
    },
  },
});

export const {setRender} = focusAreaSlice.actions;

export default focusAreaSlice.reducer;
