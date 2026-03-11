import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryReportsPage } from './inventory-reports-page';

describe('InventoryReportsPage', () => {
  let component: InventoryReportsPage;
  let fixture: ComponentFixture<InventoryReportsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryReportsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryReportsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
