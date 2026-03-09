'use client';

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  title: '',
};

const titleSlice = createSlice({
  name: 'title',
  initialState,
  reducers: {
    addTitle: (state, action) => {
      return { ...state, title: action.payload };
    },
  },
});

export const { addTitle } = titleSlice.actions;
export default titleSlice.reducer;
