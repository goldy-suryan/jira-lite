'use client';
import { createSlice } from '@reduxjs/toolkit';

let userObj;
if (typeof window != 'undefined') {
  userObj = localStorage.getItem('user');
}
const initialState = {
  user: userObj ? JSON.parse(userObj) : null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action) => {
      return { ...state, user: action.payload };
    },
  },
});

export const { addUser } = userSlice.actions;
export default userSlice.reducer;
