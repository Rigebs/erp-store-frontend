import { BrandResponse } from './brand';
import { CategoryResponse } from './category';
import { LineResponse } from './line';
import { SupplierResponse } from './supplier';
import { UnitMeasureResponse } from './unit-measure';

export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  purchasePrice: number;
  salePrice: number;
  enabled: boolean;
  flag: boolean;
  imageUrl: string;
  brand: BrandResponse;
  category: CategoryResponse;
  unitMeasure: UnitMeasureResponse;
  line: LineResponse;
  supplier: SupplierResponse;
}

export interface ProductRequest {
  name: string;
  description: string;
  purchasePrice: number;
  salePrice: number;
  imageUrl: string;
  enabled: boolean;
  flag: boolean;
  brandId: number;
  categoryId: number;
  unitMeasureId: number;
  lineId: number;
  supplierId: number;
}
