import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user.slice';
import titleReducer from './features/pageTitle.slice';
import projectReducer from './features/project.slice';
import filterReducer from './features/filters.slice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
      title: titleReducer,
      project: projectReducer,
      filters: filterReducer
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
