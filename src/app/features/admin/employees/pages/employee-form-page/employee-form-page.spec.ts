import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeFormPage } from './employee-form-page';

describe('EmployeeFormPage', () => {
  let component: EmployeeFormPage;
  let fixture: ComponentFixture<EmployeeFormPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeFormPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
