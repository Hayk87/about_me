import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface productsState {
  list: any[];
  count: number;
}

const initialState: productsState = {
  list: [],
  count: 0
}

export const ProductsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    initListAndCount: (state, action: PayloadAction<any>) => {
      return { ...state, list: [...action.payload.list], count: action.payload.count };
    },
  }
});

export const { initListAndCount } = ProductsSlice.actions;

export default ProductsSlice.reducer;
