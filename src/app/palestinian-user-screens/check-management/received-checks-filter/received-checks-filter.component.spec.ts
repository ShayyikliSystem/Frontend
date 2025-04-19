import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivedChecksFilterComponent } from './received-checks-filter.component';

describe('ReceivedChecksFilterComponent', () => {
  let component: ReceivedChecksFilterComponent;
  let fixture: ComponentFixture<ReceivedChecksFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceivedChecksFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReceivedChecksFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
