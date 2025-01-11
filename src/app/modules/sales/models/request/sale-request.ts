import { SaleDetailRequest } from './sale-detail-request';

export interface SaleRequest {
  subtotal: number;
  total: number;
  tax: number;
  discount: number;
  customerId?: number;
  cashierId: number;
  saleDetails: SaleDetailRequest[];
}
