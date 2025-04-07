import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnedChecksFilterComponent } from './returned-checks-filter.component';

describe('ReturnedChecksFilterComponent', () => {
  let component: ReturnedChecksFilterComponent;
  let fixture: ComponentFixture<ReturnedChecksFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnedChecksFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnedChecksFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
