import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFilterDialog } from './product-filter-dialog';

describe('ProductFilterDialog', () => {
  let component: ProductFilterDialog;
  let fixture: ComponentFixture<ProductFilterDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFilterDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductFilterDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
