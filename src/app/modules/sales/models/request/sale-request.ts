import { SaleDetailRequest } from './sale-detail-request';

export interface SaleRequest {
  subtotal: number;
  total: number;
  tax: number;
  discount: number;
  customerId?: number | null;
  cashierId?: number | null;
  saleDetails: SaleDetailRequest[];
}
