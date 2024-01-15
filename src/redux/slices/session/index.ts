import { createSlice } from '@reduxjs/toolkit';

const session = {};

export const sessionSlice = createSlice({
    name: 'session',
    initialState: session,
    reducers: {
        modifySession: (state, action) => ({
            ...state,
            ...action.payload
        }),
        resetSession: () => session
    }
});

export const { modifySession, resetSession } = sessionSlice.actions;

export default sessionSlice.reducer;
