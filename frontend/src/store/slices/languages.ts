import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface LanguagesState {
  list: any[]
}

const initialState: LanguagesState = {
  list: []
}

export const languagesSlice = createSlice({
  name: 'languages',
  initialState,
  reducers: {
    initLanguages: (state, action: PayloadAction<any>) => {
      return { ...state, list: [...action.payload] };
    },
  }
});

export const { initLanguages } = languagesSlice.actions

export default languagesSlice.reducer;
