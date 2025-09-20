export interface SaleFilter {
  query?: string;
  startDate?: string;
  endDate?: string;
  minTotal?: number;
  maxTotal?: number;
  status?: boolean;
  customerId?: number;
  cashierId?: number;
}
