import { EmployeeResponse } from '../../employees/models/employee';
import { SaleDetail } from './sale-detail';

export interface UserResponse {
  id: number;
  email: string;
  username: string;
  enabled: boolean;
  employee: EmployeeResponse;
}

export interface SaleResponse {
  id: number;
  dateTime: string;
  subtotal: number;
  total: number;
  tax: number;
  discount: number;
  enabled: boolean;
  customer: string;
  cashier: UserResponse;
  saleDetails: SaleDetail[];
}
