import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user.slice';
import titleReducer from './features/pageTitle.slice';
import projectReducer from './features/project.slice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
      title: titleReducer,
      project: projectReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
