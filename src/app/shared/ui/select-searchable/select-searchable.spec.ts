import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSearchable } from './select-searchable';

describe('SelectSearchable', () => {
  let component: SelectSearchable;
  let fixture: ComponentFixture<SelectSearchable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectSearchable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectSearchable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
