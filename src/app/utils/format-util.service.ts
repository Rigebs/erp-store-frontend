import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormatUtilService {
  constructor() {}

  formatPrice(price: number): number {
    return Number(price.toFixed(2));
  }
}
