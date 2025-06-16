import initialProductsFromJson from '../data/products.json';
import { Product, ProductFormData } from '../types';

const DELAY_MS = 800;

const delay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

const productsData: Product[] = JSON.parse(
  JSON.stringify(initialProductsFromJson)
) as Product[];

export const productService = {
  async getProducts(): Promise<Product[]> {
    await delay(DELAY_MS);
    return JSON.parse(JSON.stringify(productsData));
  },

  async getProductById(id: string): Promise<Product | null> {
    await delay(DELAY_MS);
    const product = productsData.find(p => p.id === id);
    return product ? JSON.parse(JSON.stringify(product)) : null;
  },

  async createProduct(productData: ProductFormData): Promise<Product> {
    await delay(DELAY_MS);
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    productsData.push(newProduct);
    return JSON.parse(JSON.stringify(newProduct));
  },

  async updateProduct(
    id: string,
    productData: Partial<ProductFormData>
  ): Promise<Product> {
    await delay(DELAY_MS);
    const productIndex = productsData.findIndex(p => p.id === id);
    if (productIndex === -1) {
      throw new Error('Producto no encontrado');
    }

    const updatedProduct: Product = {
      ...(productsData[productIndex] as Product),
      ...productData,
      updatedAt: new Date().toISOString(),
    };
    productsData[productIndex] = updatedProduct;
    return JSON.parse(JSON.stringify(updatedProduct));
  },

  async deleteProduct(id: string): Promise<void> {
    await delay(DELAY_MS);
    const productIndex = productsData.findIndex(p => p.id === id);

    if (productIndex === -1) {
      throw new Error('Producto no encontrado para eliminar');
    }

    try {
      productsData.splice(productIndex, 1);
    } catch (error) {
      console.error(
        '[productService] Error durante la operación splice:',
        error
      );
      throw error;
    }
  },

  async searchProducts(query: string): Promise<Product[]> {
    await delay(DELAY_MS);
    const lowerCaseQuery = query.toLowerCase();
    const filtered = productsData.filter(
      product =>
        product.name.toLowerCase().includes(lowerCaseQuery) ||
        product.description.toLowerCase().includes(lowerCaseQuery) ||
        product.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
    );
    return JSON.parse(JSON.stringify(filtered));
  },
};
