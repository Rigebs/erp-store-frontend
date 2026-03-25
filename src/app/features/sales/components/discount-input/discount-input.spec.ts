import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountInput } from './discount-input';

describe('DiscountInput', () => {
  let component: DiscountInput;
  let fixture: ComponentFixture<DiscountInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscountInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscountInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
