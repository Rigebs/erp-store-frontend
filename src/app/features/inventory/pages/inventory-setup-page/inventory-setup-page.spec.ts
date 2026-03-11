import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorySetupPage } from './inventory-setup-page';

describe('InventorySetupPage', () => {
  let component: InventorySetupPage;
  let fixture: ComponentFixture<InventorySetupPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventorySetupPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventorySetupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
