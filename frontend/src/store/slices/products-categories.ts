import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface productsCategoriesState {
  list: any[];
  count: number;
}

const initialState: productsCategoriesState = {
  list: [],
  count: 0
}

export const ProductsCategoriesSlice = createSlice({
  name: 'productsCategories',
  initialState,
  reducers: {
    initListAndCount: (state, action: PayloadAction<any>) => {
      return { ...state, list: [...action.payload.list], count: action.payload.count };
    },
  }
});

export const { initListAndCount } = ProductsCategoriesSlice.actions;

export default ProductsCategoriesSlice.reducer;
