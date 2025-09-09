import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit';
import { SystemUserInterface } from '../../interfaces';

export interface profileState {
  data: Partial<SystemUserInterface>;
}

const initialState: profileState = {
  data: {}
}

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    initProfile: (_state, action: PayloadAction<Partial<SystemUserInterface>>) => {
      return { ..._state, data: { ...action.payload } };
    },
  }
});

export const { initProfile } = profileSlice.actions;

export default profileSlice.reducer;
