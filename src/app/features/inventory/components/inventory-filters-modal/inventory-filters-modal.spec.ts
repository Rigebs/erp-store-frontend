import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryFiltersModal } from './inventory-filters-modal';

describe('InventoryFiltersModal', () => {
  let component: InventoryFiltersModal;
  let fixture: ComponentFixture<InventoryFiltersModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryFiltersModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryFiltersModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
