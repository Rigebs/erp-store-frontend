export interface ProductRequest {
  name: string;
  description: string;
  purchasePrice: number;
  salePrice: number;
  status: boolean;
  flag: boolean;
  brandId: number;
  categoryId: number;
  unitMeasureId: number;
  lineId: number;
  supplierId: number;
}
