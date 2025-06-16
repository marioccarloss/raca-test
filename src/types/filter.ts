import { Category, Color, ProductStatus, Size } from './product';

export type SortOption =
  | 'name_asc'
  | 'name_desc'
  | 'price_asc'
  | 'price_desc'
  | 'rating_desc'
  | 'newest'
  | 'popular';

export type PriceRange = {
  min: number;
  max: number;
};

export type ProductFilters = {
  searchTerm: string;
  categories: Category[];
  colors: Color[];
  sizes: Size[];
  priceRange: PriceRange;
  inStock: boolean;
  status: ProductStatus[];
  isNew: boolean;
  isSale: boolean;
  sortBy: SortOption;
};

export type FilterDrawerState = {
  isOpen: boolean;
  activeSection: string | null;
};

export type SearchState = {
  filters: ProductFilters;
  drawer: FilterDrawerState;
  resultsCount: number;
};
