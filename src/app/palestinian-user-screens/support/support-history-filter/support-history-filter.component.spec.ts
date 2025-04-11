import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportHistoryFilterComponent } from './support-history-filter.component';

describe('SupportHistoryFilterComponent', () => {
  let component: SupportHistoryFilterComponent;
  let fixture: ComponentFixture<SupportHistoryFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportHistoryFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SupportHistoryFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
