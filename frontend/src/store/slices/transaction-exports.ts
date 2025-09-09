import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface TransactionExportInterface {
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

export interface transactionExportsState {
  list: TransactionExportInterface[];
  count: number;
}

const initialState: transactionExportsState = {
  list: [],
  count: 0
}

export const transactionExportsSlice = createSlice({
  name: 'transactionExports',
  initialState,
  reducers: {
    initListAndCount: (state, action: PayloadAction<any>) => {
      return { ...state, list: [...action.payload.list], count: action.payload.count };
    },
  }
});

export const { initListAndCount } = transactionExportsSlice.actions;

export default transactionExportsSlice.reducer;
