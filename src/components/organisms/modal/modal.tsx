import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAppDispatch } from '../../../store/hooks';
import { closeModal, removeModal } from '../../../store/slices/ui-slice';
import { Icon } from '../../atoms/icons/icon';
import { ProductForm, ProductFormProps } from '../product-form';
import styles from './modal.module.scss';

type ModalProps = {
  id: string;
  component: string;
  title?: string;
  props?: Record<string, unknown>;
  footerContent?: React.ReactNode;
};

export function Modal({
  id,
  component,
  title = 'Modal',
  props = {},
  footerContent,
}: ModalProps) {
  const dispatch = useAppDispatch();
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    dispatch(closeModal(id));
    setTimeout(() => {
      dispatch(removeModal(id));
    }, 300);
  }, [dispatch, id]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      handleClose();
    }
  };

  const handleBackdropKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (e.target === e.currentTarget) {
        handleClose();
      }
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [handleClose]);

  const renderComponent = () => {
    switch (component) {
      case 'ProductForm':
        return (
          <ProductForm
            {...(props as ProductFormProps)}
            closeModal={handleClose}
          />
        );
      default:
        return <div>Componente no encontrado</div>;
    }
  };

  return createPortal(
    <div
      className={styles.modalBackdrop}
      onClick={handleBackdropClick}
      onKeyDown={handleBackdropKeyDown}
      role="presentation"
      tabIndex={-1}
    >
      <div
        className={styles.modalContainer}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle} id={`${id}-title`}>
            {title}
          </h2>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Cerrar modal"
          >
            <Icon name="close" size="small" />
          </button>
        </div>
        <div className={styles.modalContent}>{renderComponent()}</div>
        {footerContent && (
          <div className={styles.modalFooter}>{footerContent}</div>
        )}
      </div>
    </div>,
    document.body
  );
}
