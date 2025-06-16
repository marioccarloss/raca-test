# Raca Test - Proyecto de Interfaz de Productos

Este proyecto es una aplicación de interfaz de usuario para la gestión de productos, desarrollada con React, TypeScript, Vite, Redux Toolkit y SASS. Permite visualizar, crear, editar y eliminar productos, con validación de formularios y diferentes modos de visualización.

## 1. Configuración e Instalación

### Requisitos Previos

- Node.js (se recomienda la última versión LTS)
- npm (generalmente se instala con Node.js)

### Pasos de Instalación

1.  **Clonar el repositorio (si aplica):**
    ```bash
    git clone https://github.com/marioccarloss/raca-test
    cd raca-test
    ```
2.  **Instalar dependencias:**

    ```bash
    npm install
    ```

3.  **Ejecutar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:3000` (o el puerto que indique Vite).

### Otros Comandos Útiles

- `npm run build`: Compila la aplicación para producción.
- `npm run lint`: Ejecuta ESLint para verificar el código.
- `npm run format`: Formatea el código con Prettier.
- `npm run type-check`: Verifica los tipos de TypeScript.

## 2. Arquitectura Implementada

La aplicación sigue una arquitectura basada en componentes, utilizando los principios de Atomic Design. Este enfoque metodológico sirve tanto para el diseño de interfaces de usuario cohesivas como para la componentización estructurada en aplicaciones React, promoviendo la reutilización y la escalabilidad.

- **`src/components`**: Contiene todos los componentes de React, organizados según los niveles de Atomic Design:

  - **`atoms`**: Componentes básicos e indivisibles (ej. `Button`, `Input`, `Icon`). Son los bloques de construcción fundamentales.
  - **`molecules`**: Combinaciones de átomos que forman unidades funcionales simples y reutilizables (ej. `ConfirmationModal`, `Notification`).
  - **`organisms`**: Secciones más complejas de la interfaz, compuestas por moléculas y/o átomos, que forman partes distintivas de la interfaz (ej. `ProductCard`, `ProductForm`, `ProductGrid`, `Modal`).
  - **`pages`**: Componentes que representan vistas completas de la aplicación, construidas a partir de organismos y moléculas (ej. `HomePage`).
  - **`templates`**: Componentes que definen la estructura o layout general de las páginas, proporcionando un esqueleto para el contenido (ej. `Layout`, `Header`).

- **`src/hooks`**: Hooks personalizados de React para encapsular lógica reutilizable (ej. `useProductForm`, `useProductMutations`, `useLocalStorage`).

- **`src/store`**: Configuración y lógica de Redux Toolkit para la gestión del estado global.

  - **`slices`**: Definiciones de los diferentes "slices" del estado (ej. `productsSlice`, `filtersSlice`, `uiSlice`).
  - **`hooks.ts`**: Hooks tipados para `useDispatch` y `useSelector`.

- **`src/schemas`**: Esquemas de validación de datos utilizando Zod (ej. `product-schema.ts`).

- **`src/types`**: Definiciones de tipos e interfaces de TypeScript para todo el proyecto.

- **`src/services`**: Lógica para interactuar con APIs o fuentes de datos externas (ej. `product-service.ts` que actualmente simula una API).

- **`src/data`**: Archivos de datos estáticos o mocks (ej. `products.json`).

- **`src/styles`**: Archivos SCSS globales, variables, mixins y estilos base.

- **`src/utils`**: Funciones de utilidad genéricas (ej. `cn.ts` para concatenar clases condicionalmente).

- **`public/`**: Archivos estáticos que se sirven directamente.

**Flujo de Datos (general):**

1.  Los componentes de UI (principalmente en `pages` y `organisms`) despachan acciones a Redux.
2.  Los `slices` de Redux manejan estas acciones, actualizan el estado y, en algunos casos (como con `createAsyncThunk`), interactúan con servicios (`src/services`).
3.  Los componentes se suscriben al estado de Redux usando `useAppSelector` y se re-renderizan cuando los datos relevantes cambian.
4.  La lógica de formularios complejos se maneja localmente en componentes o se extrae a hooks personalizados (`useProductForm`), utilizando Zod para la validación antes de enviar datos al estado global o a los servicios.

## 3. Decisiones Técnicas y Justificación

- **Redux Toolkit**:

  - **Justificación**: Se ha utilizado Redux Toolkit para la gestión del estado global como parte de los requisitos de la prueba. Aunque es una solución robusta y escalable que simplifica la configuración de Redux y reduce el boilerplate, personalmente prefiero alternativas más ligeras y modernas para la gestión del estado y el cacheo de datos del servidor. Específicamente, me inclino por una combinación de **Zustand** (para el estado global de UI simple) y **TanStack Query (React Query)** (para la gestión del estado del servidor, cacheo, sincronización en segundo plano, etc.). Esta combinación suele ofrecer una mejor experiencia de desarrollo, menos boilerplate, y un rendimiento optimizado para la mayoría de los casos de uso, separando claramente el estado del cliente del estado del servidor.

- **SASS (SCSS)**:

  - **Justificación**: SASS permite escribir CSS de manera más organizada y potente, utilizando variables, mixins, anidamiento y otras características que facilitan el mantenimiento de los estilos, especialmente en una estructura de componentes. Se utilizan módulos SCSS (`*.module.scss`) para el scoping local de estilos por componente, evitando colisiones de nombres.

- **Zod**:

  - **Justificación**: Para la validación de esquemas de datos, especialmente en formularios. Zod ofrece una API fluida, inferencia de tipos excelente (lo que permite derivar tipos de TypeScript a partir de esquemas de validación) y es muy fácil de integrar.

- **ESLint y Prettier**:

  - **Justificación**: Para mantener la calidad y consistencia del código. ESLint ayuda a identificar problemas de código y aplicar buenas prácticas, mientras que Prettier asegura un formato de código uniforme en todo el proyecto.

- **Atomic Design (adaptado)**:

  - **Justificación**: La organización de componentes en `atoms`, `molecules`, `organisms`, `pages` y `templates` (una adaptación del Atomic Design) promueve la reutilización, la modularidad y una comprensión más clara de la jerarquía de la interfaz.

- **Hooks Personalizados**:
  - **Justificación**: Para encapsular lógica compleja y reutilizable relacionada con el estado o los efectos secundarios de los componentes, manteniendo los componentes más limpios y centrados en la presentación. `useProductForm` es un ejemplo clave, centralizando la validación y gestión del estado del formulario de producto.

## 4. Definiciones de Tipos e Interfaces en TypeScript

El proyecto hace un uso extensivo de TypeScript para asegurar la corrección de tipos en todo el código. Las principales definiciones de tipos e interfaces se encuentran en el directorio `src/types/`.

### `src/types/product.ts`

```typescript
// Define la estructura de un producto
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[]; // Array de URLs de imágenes
  stock: number;
  status: 'available' | 'out-of-stock' | 'discontinued';
  rating?: number | undefined; // Opcional
  isNew?: boolean | undefined; // Opcional, indica si es un producto nuevo
  isSale?: boolean | undefined; // Opcional, indica si está en oferta
  // ...otras propiedades relevantes que puedan surgir
}

// Tipo para un nuevo producto (antes de ser guardado, sin ID)
export type NewProduct = Omit<Product, 'id'>;

// Tipo para actualizaciones parciales de un producto
export type ProductUpdate = Partial<Product>;
```

### `src/types/filter.ts`

```typescript
// Define la estructura de los filtros aplicables a la lista de productos
export interface ProductFilters {
  category?: string | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  inStock?: boolean | undefined;
  searchTerm?: string | undefined;
  // ...otros criterios de filtro
}
```

### `src/types/ui.ts`

```typescript
// Define el estado de la interfaz de usuario gestionado por Redux
export interface UIState {
  editMode: boolean; // Indica si la interfaz está en modo edición
  modal: {
    isOpen: boolean;
    component: string | null; // Nombre del componente a renderizar en el modal
    props?: Record<string, any> | undefined; // Props para el componente del modal
    id?: string | undefined; // ID opcional para el modal
  };
  // ...otros estados de UI como notificaciones, loaders, etc.
}
```

### `src/hooks/use-product-form.ts` (Tipos relevantes)

El hook `useProductForm` utiliza el esquema Zod (`productSchema`) para inferir los tipos del formulario y manejar la validación. Los tipos de datos del formulario se derivan directamente del esquema.

```typescript
import { z } from 'zod';
import { productSchema } from '../schemas/product-schema'; // Asumiendo la ruta correcta

// Tipo inferido del esquema Zod para los datos del formulario
export type ProductFormData = z.infer<typeof productSchema>;
```

### `src/components/atoms/icons/icon.tsx` (Tipos relevantes)

```typescript
// ... (importaciones)
export type IconsType = keyof typeof icons; // Donde 'icons' es un objeto que mapea nombres de iconos a componentes SVG

export interface IndividualIconSvgProps extends React.SVGProps<SVGSVGElement> {
  className?: string | undefined;
}

export interface IconProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'name' | 'className'> {
  name: IconsType;
  size?: 'small' | 'medium' | 'large' | 'full';
  className?: string | undefined;
  'data-filled'?: boolean | string;
  svgProps?: IndividualIconSvgProps;
}
```
