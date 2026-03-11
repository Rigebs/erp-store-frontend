import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitMeasureListPage } from './unit-measure-list-page';

describe('UnitMeasureListPage', () => {
  let component: UnitMeasureListPage;
  let fixture: ComponentFixture<UnitMeasureListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitMeasureListPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitMeasureListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
