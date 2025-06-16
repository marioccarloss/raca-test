import { useFilteredProducts } from '../../../hooks/use-products';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  deleteProduct,
  setSelectedProduct,
} from '../../../store/slices/products-slice';
import {
  openModal,
  showInfo,
  showSuccess,
} from '../../../store/slices/ui-slice';
import { Product } from '../../../types';
import { ProductCard } from '../product-card/product-card';
import { ProductSkeleton } from '../product-skeleton/product-skeleton';
import styles from './product-grid.module.scss';

function ProductGridContent() {
  const { products, isLoading, error } = useFilteredProducts();
  const viewMode = useAppSelector(state => state.ui.viewMode);
  const dispatch = useAppDispatch();

  const handleEditProduct = (product: Product) => {
    dispatch(setSelectedProduct(product));
    dispatch(
      openModal({
        id: 'edit-product',
        component: 'ProductForm',
        props: { product },
      })
    );
  };

  const handleDeleteProduct = (product: Product) => {
    dispatch(deleteProduct(product.id))
      .unwrap()
      .then(() => {
        dispatch(
          showSuccess(`Producto "${product.name}" eliminado correctamente`)
        );
      })
      .catch(error => {
        console.error('Error al eliminar producto:', error);
        dispatch(showInfo(`Error al eliminar el producto: ${error.message}`));
      });
  };

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

  if (products.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>🔍</div>
        <h3 className={styles.emptyTitle}>No se encontraron productos</h3>
        <p className={styles.emptyMessage}>
          Intenta ajustar tus filtros o buscar otros términos
        </p>
      </div>
    );
  }

  return (
    <div className={`${styles.grid} ${styles[`grid--${viewMode}`]}`}>
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          viewMode={viewMode}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
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

export function ProductGrid() {
  return (
    <div className={styles.container}>
      <ProductGridContent />
    </div>
  );
}
