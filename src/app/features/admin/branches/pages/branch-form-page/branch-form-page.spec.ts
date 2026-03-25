import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchFormPage } from './branch-form-page';

describe('BranchFormPage', () => {
  let component: BranchFormPage;
  let fixture: ComponentFixture<BranchFormPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchFormPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
