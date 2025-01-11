import { Component, OnInit } from '@angular/core';
import { ProductSelectorComponent } from '../components/product-selector/product-selector.component';
import { SummaryComponent } from '../components/summary/summary.component';
import { SelectedProductsComponent } from '../components/selected-products/selected-products.component';
import { Product } from '../../inventory/models/product';
import { ProductService } from '../../inventory/services/product.service';
import { SaleDetailRequest } from '../models/request/sale-detail-request';
import { SaleDetail } from '../models/sale-detail';
import { FormatUtilService } from '../../../utils/format-util.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SaleRequest } from '../models/request/sale-request';
import { JwtUtilService } from '../../../utils/jwt-util.service';
import { SaleService } from '../services/sale.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-sale',
  imports: [
    ProductSelectorComponent,
    SummaryComponent,
    SelectedProductsComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './new-sale.component.html',
  styleUrl: './new-sale.component.css',
})
export class NewSaleComponent implements OnInit {
  selectedProducts: SaleDetail[] = [];
  discount = 0; // Descuento fijo (puedes cambiarlo dinámicamente si es necesario)
  products: Product[] = [];
  saleDetails: SaleDetailRequest[] = [];

  subtotal: number = 0; // Subtotal de los productos seleccionados
  taxRate: number = 0.18; // Tasa de impuesto (18%)
  total: number = 0; // Total después de impuestos y descuentos

  disabled: boolean = true;

  constructor(
    private productService: ProductService,
    private formatUtilService: FormatUtilService,
    private jwtUtilService: JwtUtilService,
    private saleService: SaleService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.productService.findAllActive().subscribe({
      next: (data) => {
        this.products = data;
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  addProduct(product: any) {
    this.disabled = false;
    const existingProduct = this.saleDetails.find(
      (p) => p.productId === (product.id | product.productId)
    );

    if (existingProduct) {
      this.saleDetails = this.saleDetails.map((item) =>
        item.productId === (product.id | product.productId)
          ? {
              ...item,
              quantity: item.quantity + 1,
              subtotal: (item.quantity + 1) * item.price,
            }
          : item
      );

      this.selectedProducts = this.selectedProducts.map((item) =>
        item.productId === (product.id | product.productId)
          ? {
              ...item,
              quantity: item.quantity + 1,
              subtotal: (item.quantity + 1) * item.price,
            }
          : item
      );
    } else {
      const formattedPrice = this.formatUtilService.formatPrice(
        product.salePrice
      );
      this.selectedProducts = [
        ...this.selectedProducts,
        {
          productId: product.id,
          quantity: 1,
          price: formattedPrice,
          subtotal: formattedPrice,
          productName: product.name,
        },
      ];
      this.saleDetails = [
        ...this.saleDetails,
        {
          productId: product.id,
          quantity: 1,
          price: formattedPrice,
          subtotal: formattedPrice,
        },
      ];
    }

    this.calculateSaleData();
  }

  deductProduct(product: any) {
    const existingProduct = this.selectedProducts.find(
      (p) => p.productId === (product.id | product.productId)
    );

    if (existingProduct!.quantity > 1) {
      this.selectedProducts = this.selectedProducts.map((item) =>
        item.productId === (product.id | product.productId)
          ? {
              ...item,
              quantity: item.quantity - 1,
              subtotal: (item.quantity - 1) * item.price,
            }
          : item
      );

      this.saleDetails = this.saleDetails.map((item) =>
        item.productId === product.id
          ? {
              ...item,
              quantity: item.quantity - 1,
              subtotal: (item.quantity - 1) * item.price,
            }
          : item
      );
    }

    this.calculateSaleData(); // Actualizar cálculos después de deducir producto
  }

  removeProduct(product: any) {
    this.selectedProducts = this.selectedProducts.filter(
      (p) => p.productId !== (product.id | product.productId)
    );

    this.saleDetails = this.saleDetails.filter(
      (p) => p.productId !== (product.id | product.productId)
    );

    this.calculateSaleData();
    if (this.saleDetails.length == 0) {
      this.disabled = true;
    }
  }

  calculateSaleData() {
    // Calcular el subtotal
    this.subtotal = this.selectedProducts.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // Calcular el total
    const tax = this.subtotal * this.taxRate;
    this.total = this.subtotal + tax - this.discount;
  }

  generateSale() {
    this.calculateSaleData();
    const sale: SaleRequest = {
      subtotal: this.subtotal,
      tax: this.formatUtilService.formatPrice(this.subtotal * this.taxRate),
      discount: this.formatUtilService.formatPrice(this.discount),
      total: this.formatUtilService.formatPrice(this.total),
      cashierId: this.jwtUtilService.getId(),

      saleDetails: this.saleDetails,
    };
    this.saleService.save(sale).subscribe({
      next: (response) => {
        this.snackBar.open(response.message, 'cerrar', {
          duration: 3000,
        });
        this.cleanData();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  cleanData() {
    // Vaciar los arrays de productos seleccionados y detalles de venta
    this.selectedProducts = [];
    this.saleDetails = [];

    // Resetear los cálculos
    this.subtotal = 0;
    this.total = 0;

    // Reiniciar el estado de otros datos, si es necesario
    this.discount = 0;
    this.disabled = true;
  }
}
