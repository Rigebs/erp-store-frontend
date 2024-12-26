import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { BrandService } from '../../services/brand.service';
import { LineService } from '../../services/line.service';
import { SupplierService } from '../../services/supplier.service';
import { UnitMeasureService } from '../../services/unit-measure.service';
import { Brand } from '../../models/brand';
import { Line } from '../../models/line';
import { Supplier } from '../../models/supplier';
import { UnitMeasure } from '../../models/unit-measure';
import { ProductService } from '../../services/product.service';
import { ProductRequest } from '../../models/request/product-request';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-form',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;

  categories: Category[] = [];
  brands: Brand[] = [];
  lines: Line[] = [];
  suppliers: Supplier[] = [];
  unitsMeasure: UnitMeasure[] = [];

  isEditMode = false;
  productId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private lineService: LineService,
    private supplierService: SupplierService,
    private unitMeasureService: UnitMeasureService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      purchasePrice: [null, [Validators.required, Validators.min(0)]],
      salePrice: [null, [Validators.required, Validators.min(0)]],
      categoryId: [''],
      brandId: [''],
      lineId: [''],
      supplierId: [''],
      unitMeasureId: [''],
    });
  }

  ngOnInit(): void {
    this.getCategories();
    this.getBrands();
    this.getLines();
    this.getSuppliers();
    this.getUnitsMeasure();

    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.isEditMode = true;
      this.loadProduct(Number(this.productId));
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      console.log('Formulario enviado:', this.productForm.value);
      if (this.isEditMode) {
        this.update(Number(this.productId), this.productForm.value);
        return;
      }
      this.save(this.productForm.value);
    } else {
      console.log('Formulario no válido');
    }
  }

  goBack() {
    this.router.navigateByUrl('management/products');
  }

  loadProduct(id: number): void {
    this.productService.findById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          purchasePrice: product.purchasePrice,
          salePrice: product.salePrice,
          categoryId: product.category?.id || null,
          brandId: product.brand?.id || null,
          lineId: product.line?.id || null,
          supplierId: product.supplier?.id || null,
          unitMeasureId: product.unitMeasure?.id || null,
        });
      },
      error: (err) => {
        console.log('Error al cargar el producto: ', err);
      },
    });
  }

  getCategories() {
    this.categoryService.findAll().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.log('error: ', err);
      },
    });
  }

  getBrands() {
    this.brandService.findAll().subscribe({
      next: (data) => {
        this.brands = data;
      },
      error: (err) => {
        console.log('error: ', err);
      },
    });
  }

  getLines() {
    this.lineService.findAll().subscribe({
      next: (data) => {
        this.lines = data;
      },
      error: (err) => {
        console.log('error: ', err);
      },
    });
  }

  getSuppliers() {
    this.supplierService.findAll().subscribe({
      next: (data) => {
        this.suppliers = data;
      },
      error: (err) => {
        console.log('error: ', err);
      },
    });
  }

  getUnitsMeasure() {
    this.unitMeasureService.findAll().subscribe({
      next: (data) => {
        this.unitsMeasure = data;
      },
      error: (err) => {
        console.log('error: ', err);
      },
    });
  }

  save(product: ProductRequest) {
    this.productService.save(product).subscribe({
      next: (response) => {
        this.snackBar.open(`${response.message}`, 'Cerrar', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.goBack();
      },
      error: (err) => {
        console.log('ERROR: ', err);
      },
    });
  }

  update(id: number, product: ProductRequest) {
    this.productService.update(id, product).subscribe({
      next: (response) => {
        this.snackBar.open(`${response.message}`, 'Cerrar', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.goBack();
      },
      error: (err) => {
        console.log('ERROR: ', err);
      },
    });
  }
}
