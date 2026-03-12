import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseCard } from './warehouse-card';

describe('WarehouseCard', () => {
  let component: WarehouseCard;
  let fixture: ComponentFixture<WarehouseCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
