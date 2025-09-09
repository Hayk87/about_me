import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface offersState {
  list: any[];
  count: number;
}

const initialState: offersState = {
  list: [],
  count: 0
}

export const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    initListAndCount: (state, action: PayloadAction<any>) => {
      return { ...state, list: [...action.payload.list], count: action.payload.count };
    },
  }
});

export const { initListAndCount } = offersSlice.actions;

export default offersSlice.reducer;
