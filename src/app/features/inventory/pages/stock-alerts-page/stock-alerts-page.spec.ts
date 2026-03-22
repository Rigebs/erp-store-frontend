import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockAlertsPage } from './stock-alerts-page';

describe('StockAlertsPage', () => {
  let component: StockAlertsPage;
  let fixture: ComponentFixture<StockAlertsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockAlertsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockAlertsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
