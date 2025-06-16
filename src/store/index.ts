import { configureStore } from '@reduxjs/toolkit';
import filtersReducer from './slices/filters-slice';
import productsReducer from './slices/products-slice';
import uiReducer from './slices/ui-slice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    filters: filtersReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
