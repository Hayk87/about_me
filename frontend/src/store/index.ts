import { configureStore } from '@reduxjs/toolkit';
import LanguagesSlice from './slices/languages';
import TranslatesSlice from './slices/translates';
import OffersSlice from './slices/offer';
import MeasurementsSlice from './slices/measurements';
import ProductsCategoriesSlice from './slices/products-categories';
import ProductsSlice from './slices/products';
import StaffsSlice from './slices/staffs';
import ProfileSlice from './slices/profile';
import SystemUsersSlice from "./slices/system-users";
import TransactionImportsSlice from "./slices/transaction-imports";
import TransactionExportsSlice from "./slices/transaction-exports";

export const store = configureStore({
  reducer: {
    languages: LanguagesSlice,
    translates: TranslatesSlice,
    offers: OffersSlice,
    measurements: MeasurementsSlice,
    productsCategories: ProductsCategoriesSlice,
    products: ProductsSlice,
    staffs: StaffsSlice,
    systemUsers: SystemUsersSlice,
    profile: ProfileSlice,
    transactionImports: TransactionImportsSlice,
    transactionExports: TransactionExportsSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch;
