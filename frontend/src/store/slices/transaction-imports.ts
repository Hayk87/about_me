import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface TransactionImportInterface {
  id: number;
  amount: number;
  created: string;
  operator_id: number;
  operator_first_name: string;
  operator_last_name: string;
  operator_email: string;
  staff_id: number;
  staff_title: Record<string, string>;
}

export interface transactionImportsState {
  list: TransactionImportInterface[];
  count: number;
}

const initialState: transactionImportsState = {
  list: [],
  count: 0
}

export const transactionImportsSlice = createSlice({
  name: 'transactionImports',
  initialState,
  reducers: {
    initListAndCount: (state, action: PayloadAction<any>) => {
      return { ...state, list: [...action.payload.list], count: action.payload.count };
    },
  }
});

export const { initListAndCount } = transactionImportsSlice.actions;

export default transactionImportsSlice.reducer;
