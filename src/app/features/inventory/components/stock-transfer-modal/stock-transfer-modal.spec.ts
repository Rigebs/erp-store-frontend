import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockTransferModal } from './stock-transfer-modal';

describe('StockTransferModal', () => {
  let component: StockTransferModal;
  let fixture: ComponentFixture<StockTransferModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockTransferModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockTransferModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
