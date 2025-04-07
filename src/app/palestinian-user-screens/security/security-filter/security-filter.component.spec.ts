import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityFilterComponent } from './security-filter.component';

describe('SecurityFilterComponent', () => {
  let component: SecurityFilterComponent;
  let fixture: ComponentFixture<SecurityFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurityFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
