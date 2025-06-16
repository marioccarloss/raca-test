import { ProductGrid } from '../../organisms/product-grid/product-grid';
import styles from './home.module.scss';

export function Home() {
  return (
    <div className={styles.home}>
      <ProductGrid />
    </div>
  );
}
