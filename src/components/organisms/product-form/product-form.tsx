import { useProductForm } from '../../../hooks/use-product-form';
import { Product } from '../../../types'; // Solo Product es necesario si el hook maneja los otros tipos
import { Button } from '../../atoms/button/button';
import { Input } from '../../atoms/input/input';
import { Select } from '../../atoms/select/select';
import styles from './product-form.module.scss';

export type ProductFormProps = {
  product?: Product;
  isNew?: boolean;
  closeModal?: () => void;
};

export function ProductForm({
  product,
  isNew = false,
  closeModal: closeModalFromProps,
}: ProductFormProps) {
  const {
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
    handleCancel,
    categoryOptions,
    sizeOptions,
    colorOptions,
    statusOptions,
  } = useProductForm({
    product,
    isNew,
    onClose: closeModalFromProps,
  });

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>
        {isNew ? 'Crear nuevo producto' : 'Editar producto'}
      </h2>

      <form
        onSubmit={handleSubmit}
        className={styles.form}
        id="product-form-id"
      >
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Nombre
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {formErrors.name && (
            <p className={styles.errorMessage}>{formErrors.name}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={styles.textarea}
            rows={4}
            required
          />
          {formErrors.description && (
            <p className={styles.errorMessage}>{formErrors.description}</p>
          )}
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="price" className={styles.label}>
              Precio
            </label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price.toString()}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
            {formErrors.price && (
              <p className={styles.errorMessage}>{formErrors.price}</p>
            )}
          </div>
        </div>

        <div className={styles.formGroup}>
          <Select
            id="category"
            name="category"
            label="Categoría"
            value={formData.category}
            onChange={handleChange}
            options={categoryOptions}
            required
          />
          {formErrors.category && (
            <p className={styles.errorMessage}>{formErrors.category}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="stock" className={styles.label}>
            Stock
          </label>
          <Input
            id="stock"
            name="stock"
            type="number"
            value={formData.stock.toString()}
            onChange={handleChange}
            min="0"
            required
          />
          {formErrors.stock && (
            <p className={styles.errorMessage}>{formErrors.stock}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <Select
            id="status"
            name="status"
            label="Estado"
            value={formData.status}
            onChange={handleChange}
            options={statusOptions}
            required
          />
          {formErrors.status && (
            <p className={styles.errorMessage}>{formErrors.status}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="sizeSelect" className={styles.label}>
            Tallas disponibles
          </label>
          <div className={styles.selectWithTags}>
            <div className={styles.selectRow}>
              <Select
                id="sizeSelect"
                value={selectedSize}
                onChange={e => setSelectedSize(e.target.value)}
                options={sizeOptions}
                className={styles.tagSelect}
              />
              <Button
                type="button"
                onClick={handleAddSize}
                variant="secondary"
                size="sm"
              >
                Agregar
              </Button>
            </div>
            {formData.sizes.length > 0 && (
              <div className={styles.tagsList}>
                {formData.sizes.map(size => (
                  <div key={size} className={styles.tag}>
                    {size}
                    <button
                      type="button"
                      onClick={() => handleRemoveSize(size)}
                      className={styles.removeTag}
                      aria-label={`Eliminar talla ${size}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {formErrors.sizes && (
            <p className={styles.errorMessage}>{formErrors.sizes}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="colorSelect" className={styles.label}>
            Colores disponibles
          </label>
          <div className={styles.selectWithTags}>
            <div className={styles.selectRow}>
              <Select
                id="colorSelect"
                value={selectedColor}
                onChange={e => setSelectedColor(e.target.value)}
                options={colorOptions}
                className={styles.tagSelect}
              />
              <Button
                type="button"
                onClick={handleAddColor}
                variant="secondary"
                size="sm"
              >
                Agregar
              </Button>
            </div>
            {formData.colors.length > 0 && (
              <div className={styles.tagsList}>
                {formData.colors.map(color => (
                  <div key={color} className={styles.tag}>
                    {color.charAt(0).toUpperCase() + color.slice(1)}
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(color)}
                      className={styles.removeTag}
                      aria-label={`Eliminar color ${color}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {formErrors.colors && (
            <p className={styles.errorMessage}>{formErrors.colors}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="imageUpload" className={styles.label}>
            Imágenes
          </label>
          <div className={styles.imageUploadContainer}>
            <div className={styles.imageUploadActions}>
              <input
                type="file"
                id="imageUpload"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                multiple
                className={styles.fileInput}
              />
              <label htmlFor="imageUpload" className={styles.uploadButton}>
                Seleccionar imágenes
              </label>
            </div>
            {previewImages.length > 0 && (
              <div className={styles.imagePreviewGrid}>
                {previewImages.map((image, index) => (
                  <div key={index} className={styles.imagePreviewContainer}>
                    <img
                      src={image}
                      alt={`Vista previa ${index + 1}`}
                      className={styles.imagePreview}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(image)}
                      className={styles.removeImageButton}
                      aria-label="Eliminar imagen"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {formErrors.images && (
            <p className={styles.errorMessage}>{formErrors.images}</p>
          )}
        </div>

        <div className={styles.formRow}>
          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="isNew"
              name="isNew"
              checked={formData.isNew}
              onChange={handleCheckboxChange}
              className={styles.checkbox}
            />
            <label htmlFor="isNew" className={styles.checkboxLabel}>
              Producto nuevo
            </label>
          </div>
          {formErrors.isNew && (
            <p className={styles.errorMessage}>{formErrors.isNew}</p>
          )}

          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="isSale"
              name="isSale"
              checked={formData.isSale}
              onChange={handleCheckboxChange}
              className={styles.checkbox}
            />
            <label htmlFor="isSale" className={styles.checkboxLabel}>
              En oferta
            </label>
          </div>
          {formErrors.isSale && (
            <p className={styles.errorMessage}>{formErrors.isSale}</p>
          )}
        </div>
        {formErrors.form && (
          <p className={styles.errorMessage}>{formErrors.form}</p>
        )}
        {/* El botón de submit está fuera del form pero lo activa con la prop 'form' */}
        {/* Sin embargo, es más común tenerlo dentro o usar form.submit() */}
        {/* Para simplificar y usar el onSubmit del form, lo movemos o cambiamos el type */}
      </form>
      <div className={styles.formActions}>
        <Button type="button" variant="secondary" onClick={handleCancel}>
          Cancelar
        </Button>
        {/* Este botón ahora es de tipo submit y activará el onSubmit del form */}
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          form="product-form-id" // Asocia este botón con el formulario por su ID
        >
          {isNew ? 'Crear producto' : 'Guardar cambios'}
        </Button>
      </div>
    </div>
  );
}
