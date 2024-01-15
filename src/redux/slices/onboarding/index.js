import { createSlice } from '@reduxjs/toolkit';
import { uniqueId } from 'lodash';

export const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState: {
    photo: null,
    createYourAccount: {
      lastname: '',
      password: '',
      old_password: '',
      name: ''
    },
    aboutYou: {
      name: '',
      lastname: '',
      charge: '',
      department: ''
    },
    evaluation: {},
    focusAreas: [],
    video: null,
    aboutYouCoach: {
      work: '',
      resume: ''
    },
    timezone: ''
  },
  reducers: {
    setPhoto: (state, action) => ({
      ...state,
      photo: action.payload
    }),

    setAboutYou: (state, action) => ({
      ...state,
      aboutYou: action.payload
    }),

    setEvaluation360: (state, action) => ({
      ...state,
      evaluation: action.payload
    }),

    setFocusArea: (state, action) => ({
      ...state,
      focusAreas: action.payload
    }),

    setVideo: (state, action) => ({
      ...state,
      video: action.payload
    }),

    setCreateYourAccount: (state, action) => ({
      ...state,
      createYourAccount: action.payload
    }),

    setAboutYouCoach: (state, action) => ({
      ...state,
      aboutYouCoach: action.payload
    }),

    addSupervisor: (state, action) => ({
      ...state,
      evaluation: {
        ...state.evaluation,
        supervisors: [...state.evaluation.supervisors, action.payload]
      }
    }),

    addColaborator: (state, action) => ({
      ...state,
      evaluation: {
        ...state.evaluation,
        colaborators: [...state.evaluation.colaborators, action.payload]
      }
    }),

    addPartner: (state, action) => ({
      ...state,
      evaluation: {
        ...state.evaluation,
        partners: [...state.evaluation.partners, action.payload]
      }
    }),

    setTimezone: (state, action) => ({
      ...state,
      timezone: action.payload
    }),

    setWorkSchedule: (state, action) => ({
      ...state,
      workSchedule: action.payload
    }),

    setLanguages: (state, action) => ({
      ...state,
      languages: action.payload
    })
  }
});

export const {
  setPhoto,
  setAboutYou,
  setEvaluation360,
  setFocusArea,
  setVideo,
  setCreateYourAccount,
  setAboutYouCoach,
  addSupervisor,
  addPartner,
  addColaborator,
  setTimezone,
  setWorkSchedule,
  setLanguages
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
