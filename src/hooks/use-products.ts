import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setResultsCount } from '../store/slices/filters-slice';
import { fetchProducts } from '../store/slices/products-slice';

export function useProducts() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector(state => state.products);
  const activeFilters = useAppSelector(state => state.filters.activeFilters);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  const filteredProducts = useMemo(() => {
    return items
      .filter(product => {
        const matchesSearch =
          !activeFilters.searchTerm ||
          product.name
            .toLowerCase()
            .includes(activeFilters.searchTerm.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(activeFilters.searchTerm.toLowerCase());

        const matchesCategory =
          activeFilters.categories.length === 0 ||
          activeFilters.categories.includes(product.category);

        const matchesStock = !activeFilters.inStock || product.stock > 0;

        return matchesSearch && matchesCategory && matchesStock;
      })
      .sort((a, b) => {
        return activeFilters.sortBy === 'price_asc'
          ? a.price - b.price
          : activeFilters.sortBy === 'price_desc'
            ? b.price - a.price
            : activeFilters.sortBy === 'newest'
              ? new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              : 0;
      });
  }, [items, activeFilters]);

  useEffect(() => {
    dispatch(setResultsCount(filteredProducts.length));
  }, [filteredProducts.length, dispatch]);

  return {
    products: filteredProducts,
    isLoading: status === 'loading',
    error,
  };
}

export function useFilteredProducts() {
  const { products, isLoading } = useProducts();

  return {
    products: products,
    totalCount: products.length,
    isLoading,
  };
}
