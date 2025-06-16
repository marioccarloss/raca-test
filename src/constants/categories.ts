import { Category } from '../types';

export type HeaderCategory = {
  name: Category | '';
  label: string;
};

export const headerCategories: HeaderCategory[] = [
  { name: '', label: 'Todas' },
  { name: 'dress', label: 'Vestidos' },
  { name: 'top', label: 'Tops' },
  { name: 'bottom', label: 'Pantalones' },
  { name: 'outerwear', label: 'Abrigos' },
  { name: 'accessories', label: 'Accesorios' },
  { name: 'shoes', label: 'Zapatos' },
];

export const filterDrawerCategories = headerCategories.map(category => ({
  value: category.name,
  label: category.label === 'Todas' ? 'Todas las categorías' : category.label,
}));
