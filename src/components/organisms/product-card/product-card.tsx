import { useState } from 'react';
import { useProductMutations } from '../../../hooks/use-product-mutations';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { toggleFavorite } from '../../../store/slices/products-slice';
import { openModal } from '../../../store/slices/ui-slice';
import { Product } from '../../../types';
import { Button } from '../../atoms/button/button';
import { Icon } from '../../atoms/icons/icon';
import { ConfirmationModal } from '../../molecules/confirmation-modal/confirmation-modal';
import styles from './product-card.module.scss';

type ProductCardProps = {
  product: Product;
  viewMode?: 'grid' | 'list';
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
};

export function ProductCard({
  product,
  viewMode = 'grid',
  onEdit,
  onDelete,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const editMode = useAppSelector(state => state.ui.editMode);
  const dispatch = useAppDispatch();
  const { deleteProduct } = useProductMutations();

  const isFavorite = useAppSelector(
    state =>
      state.products.items.find(p => p.id === product.id)?.isFavorite ?? false
  );

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavorite(product.id));
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) {
      onEdit(product);
    } else {
      dispatch(
        openModal({
          component: 'ProductForm',
          props: { product },
          id: 'edit-product-modal',
        })
      );
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (onDelete) {
      onDelete(product);
    } else {
      await deleteProduct(product.id);
    }
    setIsDeleteModalOpen(false);
  };

  const formatPrice = (price: number) => `€${price}`;

  if (viewMode === 'list') {
    return (
      <>
        <div className={`${styles.card} ${styles.cardList}`}>
          <div className={styles.listImageContainer}>
            <img
              className={styles.listImage}
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
            />
          </div>
          <div className={styles.listContentContainer}>
            <div className={styles.listMainInfo}>
              <h3 className={styles.productTitle}>{product.name}</h3>
              <p className={styles.productDescriptionList}>
                {product.description}
              </p>
            </div>
            <div className={styles.listPriceAndActions}>
              <span className={styles.priceTagList}>
                {formatPrice(product.price)}
              </span>
              {editMode && (
                <div className={styles.listEditActions}>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleEdit}
                    className={styles.listEditButton}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleDeleteClick}
                    className={styles.listDeleteButton}
                  >
                    Eliminar
                  </Button>
                </div>
              )}
            </div>
          </div>
          {!editMode && (
            <button
              className={styles.favoriteButtonList}
              onClick={handleToggleFavorite}
              type="button"
              aria-label="Add to favorites"
              data-filled={isFavorite}
            >
              <Icon
                name="heart"
                size="small"
                data-filled={isFavorite}
                className={
                  isFavorite ? styles.heartIconActive : styles.heartIcon
                }
              />
            </button>
          )}
        </div>
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Confirmar eliminación"
          message={`¿Estás seguro de que deseas eliminar el producto "${product.name}"? Esta acción no se puede deshacer.`}
        />
      </>
    );
  }

  return (
    <>
      <div
        className={styles.card}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={styles.imageContainer}>
          <img
            className={styles.image}
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
          />

          {editMode && (
            <div className={styles.editActions}>
              <Button
                variant="primary"
                size="sm"
                onClick={handleEdit}
                leftIcon={<Icon name="edit" size="small" />}
                className={styles.editButton}
              >
                Editar
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDeleteClick}
                leftIcon={<Icon name="delete" size="small" />}
                className={styles.deleteButton}
              >
                Eliminar
              </Button>
            </div>
          )}

          {isHovered && (
            <div className={styles.productInfo}>
              <div className={styles.productContent}>
                <div>
                  <h3 className={styles.productTitle}>{product.name}</h3>
                  <p className={styles.productDescription}>
                    {product.description}
                  </p>
                </div>
                <button
                  className={styles.favoriteButton}
                  onClick={handleToggleFavorite}
                  type="button"
                  aria-label="Add to favorites"
                >
                  <Icon
                    name="heart"
                    size="small"
                    data-filled={isFavorite}
                    className={
                      isFavorite ? styles.heartIconActive : styles.heartIcon
                    }
                  />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <div className={isHovered ? styles.buyNowButton : styles.arrowButton}>
            <span className={styles.buyText}>Buy now</span>
            <div className={styles.arrowContainer}>
              <Icon name="arrow" size="small" />
            </div>
          </div>
          <div className={styles.priceTag}>
            <span>{formatPrice(product.price)}</span>
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar eliminación"
        message={`¿Estás seguro de que deseas eliminar el producto "${product.name}"? Esta acción no se puede deshacer.`}
      />
    </>
  );
}
