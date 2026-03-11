import { Product } from './catalog.model';

export interface Warehouse {
  id: number;
  name: string;
  location: string;
  description: string;
  type: string;
  occupation: number;
  productsCount: number;
  valuation: number;
  main: boolean;
  enabled: boolean;
}

export type WarehousePayload = Omit<Warehouse, 'id' | 'occupation' | 'productsCount' | 'valuation'>;

export interface ProductStockByWarehouse {
  productId: string;
  warehouseId: string;
  quantity: number;
}

export type MovementType = 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT';

export interface InventoryMovement {
  id: number;
  quantity: number;
  date: string;
  type: MovementType;
  unitCostAtMovement: number;
  product: Product;
  fromWarehouse?: Warehouse;
  toWarehouse?: Warehouse;
}

export interface InventoryMovementPayload {
  productId: string;
  quantity: number;
  type: MovementType;
  reason: string;
  fromWarehouseId?: number;
  toWarehouseId?: number;
}
