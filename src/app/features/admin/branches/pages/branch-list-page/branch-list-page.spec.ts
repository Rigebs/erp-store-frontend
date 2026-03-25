import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchListPage } from './branch-list-page';

describe('BranchListPage', () => {
  let component: BranchListPage;
  let fixture: ComponentFixture<BranchListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchListPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
