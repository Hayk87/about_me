import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface measurementsState {
  list: any[];
  count: number;
}

const initialState: measurementsState = {
  list: [],
  count: 0
}

export const measurementsSlice = createSlice({
  name: 'measurements',
  initialState,
  reducers: {
    initListAndCount: (state, action: PayloadAction<any>) => {
      return { ...state, list: [...action.payload.list], count: action.payload.count };
    },
  }
});

export const { initListAndCount } = measurementsSlice.actions;

export default measurementsSlice.reducer;
