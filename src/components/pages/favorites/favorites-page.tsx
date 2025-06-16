import { ProductGrid } from '../../organisms/product-grid/product-grid';

export function FavoritesPage() {
  return (
    <div>
      <ProductGrid filterFavorites={true} />
    </div>
  );
}
