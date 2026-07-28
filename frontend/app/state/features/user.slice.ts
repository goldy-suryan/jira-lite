'use client';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type AuthenticatedUser = {
  id: string;
  name: string;
  role: string;
  email: string;
};

type UserState = {
  user: AuthenticatedUser | null;
};

const initialState: UserState = {
  user: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<AuthenticatedUser>) => {
      state.user = action.payload;
    },
  },
});

export const { addUser } = userSlice.actions;
export default userSlice.reducer;
