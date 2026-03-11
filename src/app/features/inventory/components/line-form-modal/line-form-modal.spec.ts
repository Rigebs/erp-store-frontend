import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineFormModal } from './line-form-modal';

describe('LineFormModal', () => {
  let component: LineFormModal;
  let fixture: ComponentFixture<LineFormModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineFormModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineFormModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
