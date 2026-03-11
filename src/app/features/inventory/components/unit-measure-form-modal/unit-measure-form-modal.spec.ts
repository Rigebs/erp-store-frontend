import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitMeasureFormModal } from './unit-measure-form-modal';

describe('UnitMeasureFormModal', () => {
  let component: UnitMeasureFormModal;
  let fixture: ComponentFixture<UnitMeasureFormModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitMeasureFormModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitMeasureFormModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
