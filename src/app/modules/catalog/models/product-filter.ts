export interface ProductFilter {
  query?: string;
  categoryId?: number;
  brandId?: number;
  supplierId?: number;
  unitMeasureId?: number;
  lineId?: number;
  minPrice?: number;
  maxPrice?: number;
  enabled?: boolean;
  flag?: boolean;
}
