import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentProject: null,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    addCurrentProject: (state, action) => {
      return { ...state, currentProject: action.payload };
    },
  },
});

export const { addCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
