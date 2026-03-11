import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandListPage } from './brand-list-page';

describe('BrandListPage', () => {
  let component: BrandListPage;
  let fixture: ComponentFixture<BrandListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandListPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
