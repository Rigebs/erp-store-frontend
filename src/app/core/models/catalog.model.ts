export interface Brand {
  id: number;
  name: string;
  description: string;
  productCount: number;
  enabled: boolean;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
  productsCount: number;
}

export interface UnitMeasure {
  id: number;
  name: string;
  abbreviation: string;
  description: string;
  factor: number;
  enabled: boolean;
}

export interface Line {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
  categories: Category[];
}

export interface Product {
  id: number;
  name: string;
  description: string;
  purchasePrice: number;
  salePrice: number;
  imageUrl: string;
  sku: string;
  stock: number;
  minStock: number;
  costPrice?: number;
  barcode: string;
  enabled: boolean;
  brand?: Brand;
  category?: Category;
  unitMeasure?: UnitMeasure;
}

export interface CategoryPayload extends Omit<Category, 'id' | 'productsCount' | 'enabled'> {
  lineId: number | null;
}

export interface ProductPayload extends Omit<
  Product,
  'id' | 'brand' | 'category' | 'unitMeasure' | 'line' | 'minStock' | 'stock'
> {
  brandId: number | null;
  categoryId: number | null;
  unitMeasureId: number | null;
}
