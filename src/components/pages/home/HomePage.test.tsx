import { type AsyncThunk } from '@reduxjs/toolkit';
import { MockedFunction, vi } from 'vitest';
import { type AppDispatch, type RootState } from '../../../store';
import {
  fetchProducts,
  type ThunkConfig,
} from '../../../store/slices/products-slice';
import { type Product } from '../../../types';
import { mockProducts } from '../../../utils/mock-data';
import {
  renderWithProviders,
  screen,
  waitFor,
} from '../../../utils/test-utils';
import { Home } from './home';

vi.mock('../../../store/slices/products-slice', async () => {
  const actualModule = await vi.importActual<
    typeof import('../../../store/slices/products-slice')
  >('../../../store/slices/products-slice');

  const mockThunkCreator = vi.fn() as MockedFunction<
    typeof actualModule.fetchProducts
  >;

  mockThunkCreator.pending = actualModule.fetchProducts.pending;
  mockThunkCreator.fulfilled = actualModule.fetchProducts.fulfilled;
  mockThunkCreator.rejected = actualModule.fetchProducts.rejected;
  mockThunkCreator.typePrefix = actualModule.fetchProducts.typePrefix;

  return {
    ...actualModule,
    fetchProducts: mockThunkCreator,
  };
});

const mockedFetchProducts = fetchProducts as MockedFunction<
  AsyncThunk<Product[], void, ThunkConfig>
>;

type ActualThunkFunctionType = ReturnType<typeof mockedFetchProducts>;

describe('Home Page', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders loading skeletons initially, then products', async () => {
    const thunkExecutor = async (
      dispatch: AppDispatch,
      _getState: () => RootState,
      _extra: unknown
    ) => {
      const requestId = 'test-id-success';
      const arg = undefined;

      dispatch(mockedFetchProducts.pending(requestId, arg));
      await new Promise(resolve => setTimeout(resolve, 100));
      const action = mockedFetchProducts.fulfilled(
        mockProducts,
        requestId,
        arg
      );
      dispatch(action);
      return action;
    };

    mockedFetchProducts.mockImplementation(
      () => thunkExecutor as unknown as ActualThunkFunctionType
    );

    const { unmount } = renderWithProviders(<Home />);

    const skeletons = await screen.findAllByLabelText(
      'skeleton-item',
      {},
      { timeout: 2000 }
    );
    expect(skeletons.length).toBeGreaterThan(0);

    await waitFor(
      async () => {
        for (const product of mockProducts) {
          expect(await screen.findByAltText(product.name)).toBeInTheDocument();
        }
      },
      { timeout: 5000 }
    );

    expect(screen.queryAllByLabelText('skeleton-item').length).toBe(0);
    unmount();
  });

  test('renders empty state when no products are found', async () => {
    const thunkExecutor = async (
      dispatch: AppDispatch,
      _getState: () => RootState,
      _extra: unknown
    ) => {
      const requestId = 'test-id-empty';
      const arg = undefined;
      dispatch(mockedFetchProducts.pending(requestId, arg));
      await new Promise(resolve => setTimeout(resolve, 50));
      const action = mockedFetchProducts.fulfilled([], requestId, arg);
      dispatch(action);
      return action;
    };
    mockedFetchProducts.mockImplementation(
      () => thunkExecutor as unknown as ActualThunkFunctionType
    );

    const { unmount } = renderWithProviders(<Home />);

    await waitFor(() => {
      expect(
        screen.getByText('No se encontraron productos')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Intenta ajustar tus filtros o buscar otros términos')
      ).toBeInTheDocument();
    });
    unmount();
  });

  test('renders error state when API call fails', async () => {
    const thunkExecutor = async (
      dispatch: AppDispatch,
      _getState: () => RootState,
      _extra: unknown
    ) => {
      const requestId = 'test-id-error';
      const arg = undefined;
      const error = new Error('API Error');
      dispatch(mockedFetchProducts.pending(requestId, arg));
      await new Promise(resolve => setTimeout(resolve, 50));
      const action = mockedFetchProducts.rejected(error, requestId, arg);
      dispatch(action);
      return action;
    };
    mockedFetchProducts.mockImplementation(
      () => thunkExecutor as unknown as ActualThunkFunctionType
    );

    const { unmount } = renderWithProviders(<Home />);

    await waitFor(() => {
      expect(
        screen.getByText('Error al cargar los productos')
      ).toBeInTheDocument();
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });
    unmount();
  });
});
