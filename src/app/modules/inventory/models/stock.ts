import { ProductResponse } from '../../catalog/models/product';
import { WarehouseResponse } from './warehose';

export interface StockRequest {
  productId: number;
  warehouseId: number;
  targetWarehouseId?: number;
  quantity: number;
  action: 'ADD' | 'REMOVE' | 'TRANSFER';
}

export interface StockResponse {
  id: number;
  product: ProductResponse;
  warehouse: WarehouseResponse;
  quantity: number;
  minQuantity: number;
}
