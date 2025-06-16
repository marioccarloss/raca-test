import { useAppDispatch } from '../store/hooks';
import {
  createProduct as createProductAction,
  deleteProduct as deleteProductAction,
  updateProduct as updateProductAction,
} from '../store/slices/products-slice';
import { closeModal, showError, showSuccess } from '../store/slices/ui-slice';
import { ProductFormData } from '../types';

export function useProductMutations() {
  const dispatch = useAppDispatch();

  const createProduct = async (productData: ProductFormData) => {
    try {
      await dispatch(createProductAction(productData)).unwrap();
      dispatch(showSuccess('Producto creado correctamente'));
      dispatch(closeModal('new-product')); // Asume que el ID del modal para nuevo producto es 'new-product'
    } catch (error) {
      console.error('Error al crear el producto:', error);
      dispatch(showError('Error al crear el producto'));
    }
  };

  const updateProduct = async (
    id: string,
    productData: Partial<ProductFormData>
  ) => {
    try {
      await dispatch(updateProductAction({ id, productData })).unwrap();
      dispatch(showSuccess('Producto actualizado correctamente'));
      dispatch(closeModal('edit-product')); // Asume que el ID del modal para editar producto es 'edit-product'
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      dispatch(showError('Error al actualizar el producto'));
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await dispatch(deleteProductAction(id)).unwrap();
      dispatch(showSuccess('Producto eliminado correctamente'));
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      dispatch(showError('Error al eliminar el producto'));
    }
  };

  return { createProduct, updateProduct, deleteProduct };
}
