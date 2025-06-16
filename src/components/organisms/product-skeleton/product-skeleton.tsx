import styles from './product-skeleton.module.scss';

export function ProductSkeleton() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.image} />
      <div className={styles.content}>
        <div className={styles.title} />
      </div>
    </div>
  );
}
