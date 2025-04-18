import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuedCheckFilterComponent } from './issued-check-filter.component';

describe('IssuedCheckFilterComponent', () => {
  let component: IssuedCheckFilterComponent;
  let fixture: ComponentFixture<IssuedCheckFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssuedCheckFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IssuedCheckFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
