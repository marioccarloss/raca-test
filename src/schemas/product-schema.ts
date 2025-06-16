import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es requerido.' }),
  description: z.string().min(1, { message: 'La descripción es requerida.' }),
  price: z
    .number({
      required_error: 'El precio es requerido.',
      invalid_type_error: 'El precio debe ser un número.',
    })
    .positive({ message: 'El precio debe ser un número positivo.' }),
  category: z.enum(
    ['dress', 'top', 'bottom', 'outerwear', 'accessories', 'shoes', 'lingerie'],
    {
      required_error: 'La categoría es requerida.',
    }
  ),
  images: z
    .array(z.string())
    .min(1, { message: 'Se requiere al menos una imagen.' }),
  sizes: z.array(z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL'])).default([]),
  colors: z
    .array(
      z.enum([
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
      ])
    )
    .default([]),
  stock: z
    .number({
      required_error: 'El stock es requerido.',
      invalid_type_error: 'El stock debe ser un número.',
    })
    .min(0, { message: 'El stock no puede ser negativo.' }),
  status: z
    .enum(['available', 'out_of_stock', 'pre_order'])
    .default('available'),
  rating: z.number().default(0),
  reviewCount: z.number().default(0),
  tags: z.array(z.string()).default([]),
  isNew: z.boolean().default(false),
  isSale: z.boolean().default(false),
});

export type ProductFormData = z.infer<typeof productSchema>;
