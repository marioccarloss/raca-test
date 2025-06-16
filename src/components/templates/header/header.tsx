import { useEffect, useState } from 'react';
import { headerCategories } from '../../../constants/categories';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  openDrawer,
  setActiveCategory,
  setGlobalSearchTerm,
} from '../../../store/slices/filters-slice';
import {
  openModal,
  toggleEditMode,
  toggleViewMode,
} from '../../../store/slices/ui-slice';
import { Category } from '../../../types';
import { Button } from '../../atoms/button/button';
import { Icon } from '../../atoms/icons/icon';
import { Input } from '../../atoms/input/input';
import { Toggle } from '../../atoms/toggle';
import styles from './header.module.scss';

export function Header() {
  const dispatch = useAppDispatch();
  const { activeFilters, resultsCount } = useAppSelector(
    state => state.filters
  );
  const { viewMode, editMode } = useAppSelector(state => state.ui);
  const [searchValue, setSearchValue] = useState(activeFilters.searchTerm);

  const currentActiveCategory = activeFilters.categories[0] || '';

  useEffect(() => {
    setSearchValue(activeFilters.searchTerm);
  }, [activeFilters.searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    dispatch(setGlobalSearchTerm(value));
  };

  const handleCategoryClick = (categoryName: Category | '') => {
    dispatch(setActiveCategory(categoryName));
  };

  const handleFilterClick = () => {
    dispatch(openDrawer());
  };

  const handleViewModeToggle = () => {
    dispatch(toggleViewMode());
  };

  const handleEditModeToggle = () => {
    dispatch(toggleEditMode());
  };

  const handleNewProduct = () => {
    dispatch(
      openModal({
        id: 'new-product',
        component: 'ProductForm',
        props: { isNew: true },
      })
    );
  };

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <h1 className={styles.logo}>raca store</h1>
          </div>

          <div className={styles.search}>
            <Input
              type="search"
              placeholder="Buscar productos..."
              value={searchValue}
              onChange={handleSearchChange}
              leftIcon={<Icon name="search" size="small" />}
            />
            <Toggle
              checked={editMode}
              onChange={handleEditModeToggle}
              label="Modo edición"
            />
          </div>
        </div>

        <div className={styles.navigation}>
          <nav className={styles.breadcrumbs}>
            <span className={styles.breadcrumb}>Inicio</span>
            <span className={styles.separator}>›</span>
            <span className={styles.breadcrumb}>Moda Femenina</span>
          </nav>

          <div className={styles.categories}>
            {headerCategories.map(category => (
              <button
                key={category.name}
                className={`${styles.category} ${
                  currentActiveCategory === category.name ? styles.active : ''
                }`}
                onClick={() => handleCategoryClick(category.name)}
                aria-pressed={currentActiveCategory === category.name}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.controls}>
          <div className={styles.results}>{resultsCount} productos</div>

          <div className={styles.actions}>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFilterClick}
              leftIcon={<Icon name="filter" size="small" />}
            >
              Filtros
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewModeToggle}
              leftIcon={
                viewMode === 'grid' ? (
                  <Icon name="grid" size="small" />
                ) : (
                  <Icon name="list" size="small" />
                )
              }
            >
              {viewMode === 'grid' ? 'Bloque' : 'Listado'}
            </Button>

            {editMode && (
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Icon name="add" size="small" />}
                onClick={handleNewProduct}
              >
                Nuevo
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
