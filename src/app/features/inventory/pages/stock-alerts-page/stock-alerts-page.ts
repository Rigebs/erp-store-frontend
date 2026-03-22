import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Product } from '../../../../core/models/catalog.model';
import { ProductService } from '../../services/product-service';

@Component({
  selector: 'app-stock-alerts-page',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './stock-alerts-page.html',
  styleUrl: './stock-alerts-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StockAlertsPage implements OnInit {
  private readonly productService = inject(ProductService);

  products = this.productService.products;
  isLoading = this.productService.isLoading;

  criticalCount = computed(() => this.products().filter((p) => p.stock === 0).length);

  lowStockCount = computed(
    () => this.products().filter((p) => p.stock > 0 && p.stock < p.minStock).length,
  );

  pendingOrders = signal(3);

  ngOnInit(): void {
    this.loadAlerts();
  }

  loadAlerts(): void {
    this.productService.findAll({ lowStock: true }, 0, 50).subscribe();
  }

  refreshData(): void {
    this.loadAlerts();
  }

  generateOrder(product: Product): void {
    console.log('Generating purchase order for:', product.sku);
  }
}
