import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseListPage } from './warehouse-list-page';

describe('WarehouseListPage', () => {
  let component: WarehouseListPage;
  let fixture: ComponentFixture<WarehouseListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseListPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
