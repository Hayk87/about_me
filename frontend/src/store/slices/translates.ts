import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface translatesState {
  currentTranslates: Record<string, string>;
  list: any[];
  count: number;
}

const initialState: translatesState = {
  currentTranslates: {},
  list: [],
  count: 0
}

export const translatesSlice = createSlice({
  name: 'translates',
  initialState,
  reducers: {
    initCurrentTranslates: (state, action: PayloadAction<any>) => {
      return { ...state, currentTranslates: { ...action.payload } };
    },
    initListAndCount: (state, action: PayloadAction<any>) => {
      return { ...state, list: [...action.payload.list], count: action.payload.count };
    },
  }
});

export const { initCurrentTranslates, initListAndCount } = translatesSlice.actions;

export default translatesSlice.reducer;
