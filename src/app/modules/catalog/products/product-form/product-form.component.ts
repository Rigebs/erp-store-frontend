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
import { CategoryResponse } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { BrandService } from '../../services/brand.service';
import { LineService } from '../../services/line.service';
import { SupplierService } from '../../services/supplier.service';
import { UnitMeasureService } from '../../services/unit-measure.service';
import { BrandResponse } from '../../models/brand';
import { LineResponse } from '../../models/line';
import { SupplierRequest } from '../../models/supplier';
import { UnitMeasureResponse } from '../../models/unit-measure';
import { ProductService } from '../../services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageService } from '../../services/image.service';
import { JwtUtilService } from '../../../../utils/jwt-util.service';
import { ProductResponse } from '../../models/product';

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

  categories: CategoryResponse[] = [];
  brands: BrandResponse[] = [];
  lines: LineResponse[] = [];
  suppliers: SupplierRequest[] = [];
  unitsMeasure: UnitMeasureResponse[] = [];

  isEditMode = false;
  productId: string | null = null;
  productEdit: ProductResponse | undefined;

  fileError: string | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  buttonTitle = 'Seleccionar...';
  buttonIcon = 'image';

  imageSelected = false;

  file: File | null = null;

  imageUrl: string | null = null;

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
    private snackBar: MatSnackBar,
    private imageService: ImageService,
    jwtUtilService: JwtUtilService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      purchasePrice: [null, [Validators.required, Validators.min(0)]],
      salePrice: [null, [Validators.required, Validators.min(0)]],
      userId: jwtUtilService.getId(),
      imageUrl: [''],
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
      if (this.isEditMode) {
        console.log(this.productForm.value);

        this.update(Number(this.productId), this.productForm.value);
        return;
      }
      this.save(this.productForm.value);
      console.log(this.productForm.value);
    } else {
      console.log('Formulario no válido');
    }
  }

  goBack() {
    this.router.navigateByUrl('management/products');
  }

  loadProduct(id: number): void {
    this.productService.findById(id).subscribe({
      next: (response) => {
        this.productForm.patchValue({
          name: response.data.name,
          description: response.data.description,
          purchasePrice: response.data.purchasePrice,
          salePrice: response.data.salePrice,
          categoryId: response.data.category?.id || null,
          brandId: response.data.brand?.id || null,
          lineId: response.data.line?.id || null,
          supplierId: response.data.supplier?.id || null,
          unitMeasureId: response.data.unitMeasure?.id || null,
        });
        if (response.data.imageUrl) {
          this.imagePreview = response.data.imageUrl;
          this.productForm.patchValue({
            imageUrl: response.data.imageUrl,
          });
        }
      },
      error: (err) => {
        console.log('Error al cargar el producto: ', err);
      },
    });
  }

  getCategories() {
    this.categoryService.findAll(0, 12).subscribe({
      next: (response) => {
        this.categories = response.data.content;
        console.log(response);
      },
      error: (err) => {
        console.log('error: ', err);
      },
    });
  }

  getBrands() {
    this.brandService.findAll(0, 12).subscribe({
      next: (response) => {
        this.brands = response.data.content;
      },
      error: (err) => {
        console.log('error: ', err);
      },
    });
  }

  getLines() {
    this.lineService.findAll(0, 12).subscribe({
      next: (response) => {
        this.lines = response.data.content;
      },
      error: (err) => {
        console.log('error: ', err);
      },
    });
  }

  getSuppliers() {
    this.supplierService.findAll(0, 12).subscribe({
      next: (response) => {
        this.suppliers = response.data.content;
      },
      error: (err) => {
        console.log('error: ', err);
      },
    });
  }

  getUnitsMeasure() {
    this.unitMeasureService.findAll(0, 12).subscribe({
      next: (response) => {
        this.unitsMeasure = response.data.content;
      },
      error: (err) => {
        console.log('error: ', err);
      },
    });
  }

  save(product: ProductResponse) {
    console.log(product);

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

  update(id: number, product: ProductResponse) {
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.[0]) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        this.fileError = 'El archivo debe ser una imagen.';
        this.imagePreview = null;
      } else {
        this.fileError = null;
        this.buttonTitle = 'Subir imagen';
        this.buttonIcon = 'cloud_upload';
        this.file = file;
        this.imageSelected = true;
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result;
        };
        reader.readAsDataURL(file);
      }
    }
  }

  uploadImage(): void {
    if (!this.file) {
      return;
    }
    this.imageService.uploadImage(this.file!, 'products').subscribe({
      next: (response) => {
        this.imageUrl = response.data.imageUrl;
        this.productForm.patchValue({
          imageUrl: this.imageUrl,
        });
        this.snackBar.open('Imagen subida correctamente', 'Cerrar', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      },
      error: (err) => {
        console.log('Error al subir la imagen: ', err);
        this.snackBar.open('Error al subir la imagen', 'Cerrar', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      },
    });
  }
}
