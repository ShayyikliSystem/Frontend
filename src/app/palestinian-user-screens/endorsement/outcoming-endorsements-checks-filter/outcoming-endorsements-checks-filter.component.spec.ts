import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutcomingEndorsementsChecksFilterComponent } from './outcoming-endorsements-checks-filter.component';

describe('OutcomingEndorsementsChecksFilterComponent', () => {
  let component: OutcomingEndorsementsChecksFilterComponent;
  let fixture: ComponentFixture<OutcomingEndorsementsChecksFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutcomingEndorsementsChecksFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      OutcomingEndorsementsChecksFilterComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
