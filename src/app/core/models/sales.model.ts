import { Product } from './catalog.model';
import { Person } from './user.model';

export interface Company {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface Customer {
  id: number;
  enabled: boolean;
  person?: Person;
  company?: Company;
}

export enum SaleStatus {
  PAID = 'PAID',
  CREDIT = 'CREDIT',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  TRANSFER = 'TRANSFER',
  CREDIT = 'CREDIT',
}

export interface SaleDetail {
  id?: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  totalPrice: number;
  product?: Product;
}

export interface PaymentMethodDetail {
  id?: number;
  method: PaymentMethod;
  amount: number;
}

export interface Sale {
  id: number;
  dateTime: string;
  documentType: string;
  documentNumber?: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: SaleStatus;
  customer?: Customer;
  cashier?: any;
  saleDetails: SaleDetail[];
  paymentMethods: PaymentMethodDetail[];
}

export interface SalePayload {
  subtotal: number;
  total: number;
  tax: number;
  discount: number;
  status: SaleStatus;
  documentType: string;
  customerId: number | null;
  saleDetails: SaleDetail[];
  paymentMethods: PaymentMethodDetail[];
}
