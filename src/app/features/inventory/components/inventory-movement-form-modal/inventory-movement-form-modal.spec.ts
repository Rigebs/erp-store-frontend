import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryMovementFormModal } from './inventory-movement-form-modal';

describe('InventoryMovementFormModal', () => {
  let component: InventoryMovementFormModal;
  let fixture: ComponentFixture<InventoryMovementFormModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryMovementFormModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryMovementFormModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
