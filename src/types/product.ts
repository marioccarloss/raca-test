export type Category =
  | 'dress'
  | 'top'
  | 'bottom'
  | 'outerwear'
  | 'accessories'
  | 'shoes'
  | 'lingerie';

export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export type Color =
  | 'black'
  | 'white'
  | 'red'
  | 'blue'
  | 'green'
  | 'pink'
  | 'purple'
  | 'beige'
  | 'brown'
  | 'gray';

export type ProductStatus = 'available' | 'out_of_stock' | 'pre_order';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: Category;
  images: string[];
  sizes: Size[];
  colors: Color[];
  stock: number;
  status: ProductStatus;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isSale?: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type ProductFormData = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
