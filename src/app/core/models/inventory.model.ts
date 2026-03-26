import { Branch } from './branch.model';
import { Product } from './catalog.model';

export type WarehouseType =
  | 'CENTRAL'
  | 'POINT_OF_SALE'
  | 'TRANSIT'
  | 'QUARANTINE'
  | 'INTERNAL_CONSUMPTION';

export interface Warehouse {
  id: number;
  name: string;
  location: string;
  description: string;
  type: WarehouseType;
  occupation: number;
  productsCount: number;
  valuation: number;
  main: boolean;
  enabled: boolean;
  branch: Branch;
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
