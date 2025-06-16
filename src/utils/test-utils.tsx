import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { RenderOptions, render as rtlRender } from '@testing-library/react';
import { PropsWithChildren, ReactElement } from 'react';
import { Provider } from 'react-redux';

import filtersReducer, { FiltersState } from '../store/slices/filters-slice';
import productsReducer, { ProductsState } from '../store/slices/products-slice';
import uiReducer, { UIState } from '../store/slices/ui-slice';

export interface RootState {
  products: ProductsState;
  ui: UIState;
  filters: FiltersState;
}

const rootReducer = {
  products: productsReducer,
  ui: uiReducer,
  filters: filtersReducer,
};

export type AppStore = EnhancedStore<RootState>;

export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState,
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<unknown>) {
    return <Provider store={store}>{children}</Provider>;
  }
  return { store, ...rtlRender(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react';
export { renderWithProviders as render };
