import { filterDrawerCategories } from '../../../constants/categories';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  applyFilters,
  closeDrawer,
  resetDraftToActive,
  setDraftCategories,
  setDraftInStock,
  setDraftPriceRange,
  setDraftSearchTerm,
} from '../../../store/slices/filters-slice';
import { Category, PriceRange } from '../../../types';
import { Button } from '../../atoms/button/button';
import { Checkbox } from '../../atoms/checkbox/checkbox';
import { Icon } from '../../atoms/icons/icon';
import { Input } from '../../atoms/input/input';
import { Range } from '../../atoms/range/range';
import { Select } from '../../atoms/select/select';
import styles from './filter-drawer.module.scss';

export function FilterDrawer() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(state => state.filters.drawer.isOpen);
  const draftFilters = useAppSelector(state => state.filters.draftFilters);

  const handleClose = () => {
    dispatch(closeDrawer());
    dispatch(resetDraftToActive());
  };

  const handleApply = () => {
    dispatch(applyFilters());
    dispatch(closeDrawer());
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setDraftSearchTerm(e.target.value));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === '') {
      dispatch(setDraftCategories([]));
    } else {
      dispatch(setDraftCategories([value as Category]));
    }
  };

  const handlePriceRangeChange = (value: PriceRange) => {
    dispatch(setDraftPriceRange(value));
  };

  const handleInStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setDraftInStock(e.target.checked));
  };

  if (!isOpen) return null;

  return (
    <div className={styles.container}>
      <div
        className={styles.backdrop}
        onClick={handleClose}
        onKeyDown={e => e.key === 'Escape' && handleClose()}
        role="button"
        tabIndex={0}
        aria-label="Cerrar filtros"
      />
      <div className={styles.drawer}>
        <div className={styles.header}>
          <h2 className={styles.title}>Filtros</h2>
          <button
            className={styles.close}
            onClick={handleClose}
            aria-label="Cerrar filtros"
          >
            ×
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.filterSection}>
            <h3 className={styles.sectionTitle}>Buscar</h3>
            <Input
              placeholder="Buscar por nombre de producto"
              value={draftFilters.searchTerm}
              onChange={handleSearchChange}
              leftIcon={<Icon name="search" size="small" />}
            />
          </div>

          <div className={styles.filterSection}>
            <h3 className={styles.sectionTitle}>Categoría</h3>
            <Select
              options={filterDrawerCategories}
              value={draftFilters.categories[0] || ''}
              onChange={handleCategoryChange}
              label="Selecciona una categoría"
            />
          </div>

          <div className={styles.filterSection}>
            <h3 className={styles.sectionTitle}>Rango de precio</h3>
            <Range
              min={0}
              max={500}
              value={draftFilters.priceRange}
              onChange={handlePriceRangeChange}
              label="Precio (€)"
            />
          </div>

          <div className={styles.filterSection}>
            <h3 className={styles.sectionTitle}>Disponibilidad</h3>
            <Checkbox
              label="Solo productos en stock"
              checked={draftFilters.inStock}
              onChange={handleInStockChange}
            />
          </div>
        </div>

        <div className={styles.actions}>
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            className={styles.resetButton}
            onClick={handleApply}
            type="button"
            variant="primary"
          >
            Aplicar filtros
          </Button>
        </div>
      </div>
    </div>
  );
}
