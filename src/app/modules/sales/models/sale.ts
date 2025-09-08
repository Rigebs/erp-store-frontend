import { SaleDetail } from './sale-detail';

export interface Sale {
  id: number;
  dateTime: string;
  subtotal: number;
  total: number;
  tax: number;
  discount: number;
  enabled: boolean;
  customer: string;
  saleDetails: SaleDetail[];
}
