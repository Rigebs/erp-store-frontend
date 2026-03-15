import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseFormModal } from './warehouse-form-modal';

describe('WarehouseFormModal', () => {
  let component: WarehouseFormModal;
  let fixture: ComponentFixture<WarehouseFormModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseFormModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseFormModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
