import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, Observable } from 'rxjs';
import { SelectSearchable } from '../../../../shared/ui/select-searchable/select-searchable';
import { BrandService } from '../../services/brand-service';
import { CategoryService } from '../../services/category-service';
import { LineService } from '../../services/line-service';
import { ProductService } from '../../services/product-service';
import { UnitMeasureService } from '../../services/unit-measure-service';
import { FormError } from '../../../../shared/components/form-error/form-error';
import { ImageUpload } from '../../../../shared/ui/image-upload/image-upload';
import { ImageService } from '../../services/image-service';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, RouterLink, SelectSearchable, FormError, ImageUpload],
  templateUrl: './product-form-page.html',
  styleUrl: './product-form-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFormPage implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly productService = inject(ProductService);
  private readonly brandService = inject(BrandService);
  private readonly categoryService = inject(CategoryService);
  private readonly unitService = inject(UnitMeasureService);
  private readonly imageService = inject(ImageService);
  private readonly lineService = inject(LineService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  isEditMode = signal(false);
  productId = signal<number | null>(null);
  isLoading = this.productService.isLoading;

  isUploadingImage = signal(false);

  brands = toSignal(this.brandService.findAll().pipe(map((r) => r.content)), { initialValue: [] });
  categories = toSignal(this.categoryService.findAll().pipe(map((r) => r.content)), {
    initialValue: [],
  });
  units = toSignal(this.unitService.findAll().pipe(map((r) => r.content)), { initialValue: [] });
  lines = toSignal(this.lineService.findAll().pipe(map((r) => r.content)), { initialValue: [] });

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    sku: ['', [Validators.required]],
    barcode: ['', [Validators.required]],
    purchasePrice: [null as unknown as number, [Validators.required, Validators.min(0)]],
    salePrice: [null as unknown as number, [Validators.required, Validators.min(0)]],
    minStock: [null as unknown as number, [Validators.required, Validators.min(0)]],
    imageUrl: [''],
    enabled: [true],
    brand: [null as any],
    category: [null as any],
    unitMeasure: [null as any],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.productId.set(Number(id));
      this.loadProduct(Number(id));
    }
  }

  protected isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  private loadProduct(id: number): void {
    this.productService.findById(id).subscribe({
      next: (product) => {
        this.form.patchValue({
          ...product,
          brand: product.brand ?? null,
          category: product.category ?? null,
          unitMeasure: product.unitMeasure ?? null,
        });
      },
      error: () => this.router.navigate(['/products']),
    });
  }

  onImageUpload(file: File): void {
    this.isUploadingImage.set(true);
    this.imageService.upload(file).subscribe({
      next: (response) => {
        this.form.patchValue({ imageUrl: response.imageUrl });
        this.isUploadingImage.set(false);
      },
      error: (err) => {
        (console.error('Error al subir imagen', err), this.isUploadingImage.set(false));
      },
    });
  }

  onImageRemove(): void {
    this.form.patchValue({ imageUrl: '' });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const rawValues = this.form.getRawValue();
    const payload = {
      ...rawValues,
      brandId: rawValues.brand?.id,
      categoryId: rawValues.category?.id,
      unitMeasureId: rawValues.unitMeasure?.id,
    };

    const request$: Observable<any> = this.isEditMode()
      ? this.productService.update(this.productId()!, payload)
      : this.productService.save(payload);

    request$.subscribe({
      next: () => this.router.navigate(['/inventory/products']),
      error: (err: unknown) => console.error(err),
    });
  }
}
