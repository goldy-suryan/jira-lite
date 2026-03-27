import { createSelector, createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentProject: null,
  filteredTasks: null,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    addCurrentProject: (state, action) => {
      return { ...state, currentProject: action.payload };
    },
    addFilteredTasks: (state, action) => {
      return { ...state, filteredTasks: action.payload };
    },
  },
});

export const selectUsers = (state) => state.project?.currentProject?.users;
export const selectUsersById = createSelector([selectUsers], (users) => {
  if (!users) return { byId: {}, allIds: [] };
  const byId = {};
  const allIds: any = [];

  for (const user of users) {
    byId[user.id] = user;
    allIds.push(user.id);
  }

  return { byId, allIds };
});

export const { addCurrentProject, addFilteredTasks } = projectSlice.actions;
export default projectSlice.reducer;
