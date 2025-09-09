import { ProductResponse } from '../../catalog/models/product';
import { WarehouseResponse } from './warehose';

// Request para crear un movimiento
export interface InventoryMovementRequest {
  productId: number;
  fromWarehouseId?: number;
  toWarehouseId?: number;
  quantity: number;
  type: 'IN' | 'OUT' | 'TRANSFER';
}

export interface InventoryMovementResponse {
  id: number;
  product: ProductResponse;
  fromWarehouse?: WarehouseResponse;
  toWarehouse?: WarehouseResponse;
  quantity: number;
  type: 'IN' | 'OUT' | 'TRANSFER';
  date: string;
}
