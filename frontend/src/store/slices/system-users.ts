import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface systemUsersState {
  list: any[];
  count: number;
}

const initialState: systemUsersState = {
  list: [],
  count: 0
}

export const systemUsersSlice = createSlice({
  name: 'systemUsers',
  initialState,
  reducers: {
    initListAndCount: (state, action: PayloadAction<any>) => {
      return { ...state, list: [...action.payload.list], count: action.payload.count };
    },
  }
});

export const { initListAndCount } = systemUsersSlice.actions;

export default systemUsersSlice.reducer;
