import { useEffect, useRef, useState } from 'react';
import { ZodError } from 'zod';
import { productSchema } from '../schemas/product-schema';
import { useAppDispatch } from '../store/hooks';
import { closeModal as closeReduxModal } from '../store/slices/ui-slice';
import {
  Category,
  Color,
  Product,
  ProductFormData,
  ProductStatus,
  Size,
} from '../types';
import { useProductMutations } from './use-product-mutations';

export type UseProductFormProps = {
  product?: Product | undefined;
  isNew?: boolean | undefined;
  onClose?: (() => void) | undefined;
};

export type FormErrors = Partial<
  Record<keyof ProductFormData | string, string>
>;

const initialFormState: ProductFormData = {
  name: '',
  description: '',
  price: 0,
  category: 'dress',
  images: [],
  sizes: [],
  colors: [],
  stock: 0,
  status: 'available',
  rating: 0,
  reviewCount: 0,
  tags: [],
  isNew: false,
  isSale: false,
};

export const useProductForm = ({
  product,
  isNew: isCreatingNewProduct = false,
  onClose,
}: UseProductFormProps) => {
  const dispatch = useAppDispatch();
  const { createProduct, updateProduct } = useProductMutations();
  const [formData, setFormData] = useState<ProductFormData>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (product && !isCreatingNewProduct) {
      const newIsNew =
        product.isNew === undefined ? initialFormState.isNew : product.isNew;
      const newIsSale =
        product.isSale === undefined ? initialFormState.isSale : product.isSale;

      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        images: product.images ?? initialFormState.images,
        sizes: product.sizes ?? initialFormState.sizes,
        colors: product.colors ?? initialFormState.colors,
        stock: product.stock,
        status: product.status ?? initialFormState.status,
        rating: product.rating ?? initialFormState.rating,
        reviewCount: product.reviewCount ?? initialFormState.reviewCount,
        tags: product.tags ?? initialFormState.tags,
        isNew: !!newIsNew,
        isSale: !!newIsSale,
      });
      setPreviewImages(product.images || []);
    } else {
      setFormData(initialFormState);
      setPreviewImages([]);
    }
  }, [product, isCreatingNewProduct]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const isNumericField = name === 'price' || name === 'stock';

    setFormData(prev => ({
      ...prev,
      [name]: isNumericField
        ? Number(value)
        : type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : value,
    }));

    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleAddSize = () => {
    if (selectedSize && !formData.sizes.includes(selectedSize as Size)) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, selectedSize as Size],
      }));
      setSelectedSize('');
    }
  };

  const handleRemoveSize = (sizeToRemove: Size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter(size => size !== sizeToRemove),
    }));
  };

  const handleAddColor = () => {
    if (selectedColor && !formData.colors.includes(selectedColor as Color)) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, selectedColor as Color],
      }));
      setSelectedColor('');
    }
  };

  const handleRemoveColor = (colorToRemove: Color) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(color => color !== colorToRemove),
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImageFiles = Array.from(files);
    const newImageUrls = newImageFiles.map(file => URL.createObjectURL(file));

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImageUrls],
    }));
    setPreviewImages(prev => [...prev, ...newImageUrls]);

    if (formErrors.images) {
      setFormErrors(prev => ({ ...prev, images: undefined }));
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (imageToRemove: string) => {
    if (imageToRemove.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove);
    }
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(image => image !== imageToRemove),
    }));
    setPreviewImages(prev => prev.filter(image => image !== imageToRemove));
  };

  const handleCloseModal = () => {
    if (onClose) {
      onClose();
    } else {
      dispatch(closeReduxModal('product-form-modal'));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormErrors({});
    setIsSubmitting(true);

    try {
      const validatedData = productSchema.parse(formData);

      const productDataToSubmit = {
        ...validatedData,
      };

      if (isCreatingNewProduct) {
        await createProduct(productDataToSubmit);
      } else if (product) {
        await updateProduct(product.id, productDataToSubmit);
      }

      handleCloseModal();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: FormErrors = {};
        error.errors.forEach(err => {
          if (err.path.length > 0) {
            errors[err.path[0] as keyof ProductFormData] = err.message;
          }
        });
        setFormErrors(errors);
      } else {
        setFormErrors({
          form: 'Error al enviar el formulario. Intente de nuevo.',
        });
        console.error('Submission error:', error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories: Category[] = [
    'dress',
    'top',
    'bottom',
    'outerwear',
    'accessories',
    'shoes',
    'lingerie',
  ];
  const categoryOptions = categories.map(category => ({
    value: category,
    label: category.charAt(0).toUpperCase() + category.slice(1),
  }));

  const sizes: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const sizeOptions = sizes.map(size => ({ value: size, label: size }));

  const colors: Color[] = [
    'black',
    'white',
    'red',
    'blue',
    'green',
    'pink',
    'purple',
    'beige',
    'brown',
    'gray',
  ];
  const colorOptions = colors.map(color => ({
    value: color,
    label: color.charAt(0).toUpperCase() + color.slice(1),
  }));

  const statuses: ProductStatus[] = ['available', 'out_of_stock', 'pre_order'];
  const statusOptions = statuses.map(status => ({
    value: status,
    label:
      status === 'available'
        ? 'Disponible'
        : status === 'out_of_stock'
          ? 'Sin stock'
          : 'Pre-orden',
  }));

  return {
    formData,
    isSubmitting,
    formErrors,
    selectedSize,
    setSelectedSize,
    selectedColor,
    setSelectedColor,
    previewImages,
    fileInputRef,
    handleChange,
    handleCheckboxChange,
    handleAddSize,
    handleRemoveSize,
    handleAddColor,
    handleRemoveColor,
    handleImageUpload,
    handleRemoveImage,
    handleSubmit,
    handleCancel: handleCloseModal,
    categoryOptions,
    sizeOptions,
    colorOptions,
    statusOptions,
  };
};
