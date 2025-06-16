import { useFilteredProducts } from '../../../hooks/use-products';
import { useAppSelector } from '../../../store/hooks';
import { ProductCard } from '../product-card/product-card';
import { ProductSkeleton } from '../product-skeleton/product-skeleton';
import styles from './product-grid.module.scss';

interface ProductGridProps {
  filterFavorites?: boolean;
}

function ProductGridContent({ filterFavorites }: ProductGridProps) {
  const { products, isLoading, error } = useFilteredProducts();
  const viewMode = useAppSelector(state => state.ui.viewMode);

  if (isLoading) {
    return <GridSkeleton />;
  }

  if (error) {
    return (
      <div className={styles.errorState}>
        <div className={styles.errorIcon}>😞</div>
        <h3 className={styles.errorTitle}>Error al cargar los productos</h3>
        <p className={styles.errorMessage}>
          {typeof error === 'string' ? error : 'Por favor, inténtalo de nuevo.'}
        </p>
      </div>
    );
  }

  const displayedProducts = filterFavorites
    ? products.filter(p => p.isFavorite)
    : products;

  if (displayedProducts.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>{filterFavorites ? '🤍' : '🔍'}</div>
        <h3 className={styles.emptyTitle}>
          {filterFavorites
            ? 'No tienes productos favoritos'
            : 'No se encontraron productos'}
        </h3>
        <p className={styles.emptyMessage}>
          {filterFavorites
            ? 'Añade productos a tus favoritos para verlos aquí'
            : 'Intenta ajustar tus filtros o buscar otros términos'}
        </p>
      </div>
    );
  }

  return (
    <div className={`${styles.grid} ${styles[`grid--${viewMode}`]}`}>
      {displayedProducts.map(product => (
        <ProductCard key={product.id} product={product} viewMode={viewMode} />
      ))}
    </div>
  );
}

function GridSkeleton() {
  const viewMode = useAppSelector(state => state.ui.viewMode);
  return (
    <div className={`${styles.grid} ${styles[`grid--${viewMode}`]}`}>
      {Array.from({ length: 8 }).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
}

export function ProductGrid({ filterFavorites = false }: ProductGridProps) {
  return (
    <div className={styles.container}>
      <ProductGridContent filterFavorites={filterFavorites} />
    </div>
  );
}
