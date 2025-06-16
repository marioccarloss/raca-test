import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Category,
  Color,
  FilterDrawerState,
  PriceRange,
  ProductFilters,
  ProductStatus,
  Size,
  SortOption,
} from '../../types';

export type FiltersState = {
  activeFilters: ProductFilters;
  draftFilters: ProductFilters;
  drawer: FilterDrawerState;
  resultsCount: number;
};

const initialFilters: ProductFilters = {
  searchTerm: '',
  categories: [],
  colors: [],
  sizes: [],
  priceRange: { min: 0, max: 500 },
  inStock: false,
  status: [],
  isNew: false,
  isSale: false,
  sortBy: 'newest' as SortOption,
};

const initialState: FiltersState = {
  activeFilters: initialFilters,
  draftFilters: initialFilters,
  drawer: {
    isOpen: false,
    activeSection: null,
  },
  resultsCount: 0,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    // Acciones que modifican draftFilters
    setDraftSearchTerm: (state, action: PayloadAction<string>) => {
      state.draftFilters.searchTerm = action.payload;
    },
    toggleDraftCategory: (state, action: PayloadAction<Category>) => {
      const category = action.payload;
      const index = state.draftFilters.categories.indexOf(category);
      if (index === -1) {
        state.draftFilters.categories.push(category);
      } else {
        state.draftFilters.categories.splice(index, 1);
      }
    },
    setDraftCategories: (state, action: PayloadAction<Category[]>) => {
      state.draftFilters.categories = action.payload;
    },
    toggleDraftColor: (state, action: PayloadAction<Color>) => {
      const color = action.payload;
      const index = state.draftFilters.colors.indexOf(color);
      if (index === -1) {
        state.draftFilters.colors.push(color);
      } else {
        state.draftFilters.colors.splice(index, 1);
      }
    },
    setDraftColors: (state, action: PayloadAction<Color[]>) => {
      state.draftFilters.colors = action.payload;
    },
    toggleDraftSize: (state, action: PayloadAction<Size>) => {
      const size = action.payload;
      const index = state.draftFilters.sizes.indexOf(size);
      if (index === -1) {
        state.draftFilters.sizes.push(size);
      } else {
        state.draftFilters.sizes.splice(index, 1);
      }
    },
    setDraftSizes: (state, action: PayloadAction<Size[]>) => {
      state.draftFilters.sizes = action.payload;
    },
    setDraftPriceRange: (state, action: PayloadAction<PriceRange>) => {
      state.draftFilters.priceRange = action.payload;
    },
    toggleDraftInStock: state => {
      state.draftFilters.inStock = !state.draftFilters.inStock;
    },
    setDraftInStock: (state, action: PayloadAction<boolean>) => {
      state.draftFilters.inStock = action.payload;
    },
    toggleDraftStatus: (state, action: PayloadAction<ProductStatus>) => {
      const status = action.payload;
      const index = state.draftFilters.status.indexOf(status);
      if (index === -1) {
        state.draftFilters.status.push(status);
      } else {
        state.draftFilters.status.splice(index, 1);
      }
    },
    setDraftStatus: (state, action: PayloadAction<ProductStatus[]>) => {
      state.draftFilters.status = action.payload;
    },
    toggleDraftIsNew: state => {
      state.draftFilters.isNew = !state.draftFilters.isNew;
    },
    setDraftIsNew: (state, action: PayloadAction<boolean>) => {
      state.draftFilters.isNew = action.payload;
    },
    toggleDraftIsSale: state => {
      state.draftFilters.isSale = !state.draftFilters.isSale;
    },
    setDraftIsSale: (state, action: PayloadAction<boolean>) => {
      state.draftFilters.isSale = action.payload;
    },
    setDraftSortBy: (state, action: PayloadAction<SortOption>) => {
      state.draftFilters.sortBy = action.payload;
    },

    setGlobalSearchTerm: (state, action: PayloadAction<string>) => {
      state.activeFilters.searchTerm = action.payload;
      state.draftFilters.searchTerm = action.payload;
    },

    setActiveCategory: (state, action: PayloadAction<Category | ''>) => {
      const category = action.payload;
      if (category === '') {
        state.activeFilters.categories = [];
        state.draftFilters.categories = [];
      } else {
        state.activeFilters.categories = [category];
        state.draftFilters.categories = [category];
      }
    },

    applyFilters: state => {
      state.activeFilters = JSON.parse(JSON.stringify(state.draftFilters));
    },

    resetFilters: state => {
      state.activeFilters = initialFilters;
      state.draftFilters = initialFilters;
    },

    resetDraftToActive: state => {
      state.draftFilters = JSON.parse(JSON.stringify(state.activeFilters));
    },

    openDrawer: state => {
      state.drawer.isOpen = true;
      state.draftFilters = JSON.parse(JSON.stringify(state.activeFilters));
    },
    closeDrawer: state => {
      state.drawer.isOpen = false;
    },
    setActiveDrawerSection: (state, action: PayloadAction<string | null>) => {
      state.drawer.activeSection = action.payload;
    },
    setResultsCount: (state, action: PayloadAction<number>) => {
      state.resultsCount = action.payload;
    },
  },
});

export const {
  setDraftSearchTerm,
  toggleDraftCategory,
  setDraftCategories,
  toggleDraftColor,
  setDraftColors,
  toggleDraftSize,
  setDraftSizes,
  setDraftPriceRange,
  toggleDraftInStock,
  setDraftInStock,
  toggleDraftStatus,
  setDraftStatus,
  toggleDraftIsNew,
  setDraftIsNew,
  toggleDraftIsSale,
  setDraftIsSale,
  setDraftSortBy,
  setGlobalSearchTerm,
  setActiveCategory,
  applyFilters,
  resetFilters,
  resetDraftToActive,
  openDrawer,
  closeDrawer,
  setActiveDrawerSection,
  setResultsCount,
} = filtersSlice.actions;

export default filtersSlice.reducer;
