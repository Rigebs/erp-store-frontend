import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandFormModal } from './brand-form-modal';

describe('BrandFormModal', () => {
  let component: BrandFormModal;
  let fixture: ComponentFixture<BrandFormModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandFormModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandFormModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
