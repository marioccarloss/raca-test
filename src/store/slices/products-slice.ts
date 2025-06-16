import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { productService } from '../../services/product-service';
import { LoadingState, Product, ProductFormData } from '../../types';
import type { AppDispatch, RootState } from '../index';

export type ProductsState = {
  items: Product[];
  status: LoadingState;
  error: string | null;
  selectedProduct: Product | null;
};

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
  selectedProduct: null,
};

export interface ThunkConfig {
  dispatch: AppDispatch;
  state: RootState;
}

export const fetchProducts = createAsyncThunk<
  Product[], // Tipo de retorno del payloadCreator
  void, // Tipo del argumento del thunk (ThunkArg)
  ThunkConfig // Tipos para thunkAPI (dispatch, getState, etc.)
>('products/fetchProducts', async (_arg, _thunkAPI) => {
  return await productService.getProducts();
});

export const fetchProductById = createAsyncThunk<
  Product | null,
  string,
  ThunkConfig
>('products/fetchProductById', async (id, _thunkAPI) => {
  return await productService.getProductById(id);
});

export const createProduct = createAsyncThunk<
  Product,
  ProductFormData,
  ThunkConfig
>('products/createProduct', async (productData, _thunkAPI) => {
  return await productService.createProduct(productData);
});

export const updateProduct = createAsyncThunk<
  Product,
  { id: string; productData: Partial<ProductFormData> },
  ThunkConfig
>('products/updateProduct', async ({ id, productData }, _thunkAPI) => {
  return await productService.updateProduct(id, productData);
});

export const deleteProduct = createAsyncThunk<string, string, ThunkConfig>(
  'products/deleteProduct',
  async (id, _thunkAPI) => {
    await productService.deleteProduct(id);
    return id;
  }
);

export const searchProducts = createAsyncThunk<Product[], string, ThunkConfig>(
  'products/searchProducts',
  async (query, _thunkAPI) => {
    return await productService.searchProducts(query);
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error al cargar productos';
      })

      // Fetch Product By Id
      .addCase(fetchProductById.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          action.error.message || 'Error al cargar el producto seleccionado';
      })

      // Create Product
      .addCase(createProduct.pending, state => {
        state.status = 'loading';
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error al crear el producto';
      })

      // Update Product
      .addCase(updateProduct.pending, state => {
        state.status = 'loading';
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.items.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedProduct?.id === action.payload.id) {
          state.selectedProduct = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error al actualizar el producto';
      })

      // Delete Product
      .addCase(deleteProduct.pending, state => {
        state.status = 'loading';
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = state.items.filter(p => p.id !== action.payload);
        if (state.selectedProduct?.id === action.payload) {
          state.selectedProduct = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error al eliminar el producto';
      })

      // Search Products
      .addCase(searchProducts.pending, state => {
        state.status = 'loading';
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error al buscar productos';
      });
  },
});

export const { setSelectedProduct } = productsSlice.actions;
export default productsSlice.reducer;
