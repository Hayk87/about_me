import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface staffsState {
  list: any[];
  count: number;
}

const initialState: staffsState = {
  list: [],
  count: 0
}

export const staffsSlice = createSlice({
  name: 'staffs',
  initialState,
  reducers: {
    initListAndCount: (state, action: PayloadAction<any>) => {
      return { ...state, list: [...action.payload.list], count: action.payload.count };
    },
  }
});

export const { initListAndCount } = staffsSlice.actions;

export default staffsSlice.reducer;
