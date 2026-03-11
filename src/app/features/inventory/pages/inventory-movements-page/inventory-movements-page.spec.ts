import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryMovementsPage } from './inventory-movements-page';

describe('InventoryMovementsPage', () => {
  let component: InventoryMovementsPage;
  let fixture: ComponentFixture<InventoryMovementsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryMovementsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryMovementsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
