import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingEndorsementsChecksFilterComponent } from './incoming-endorsements-checks-filter.component';

describe('IncomingEndorsementsChecksFilterComponent', () => {
  let component: IncomingEndorsementsChecksFilterComponent;
  let fixture: ComponentFixture<IncomingEndorsementsChecksFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomingEndorsementsChecksFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      IncomingEndorsementsChecksFilterComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
