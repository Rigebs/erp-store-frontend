import { ProductResponse } from '../../catalog/models/product';

export interface CartItem {
  product: ProductResponse;
  quantity: number;
}
