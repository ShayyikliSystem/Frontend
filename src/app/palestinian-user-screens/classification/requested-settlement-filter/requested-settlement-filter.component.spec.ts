import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestedSettlementFilterComponent } from './requested-settlement-filter.component';

describe('RequestedSettlementFilterComponent', () => {
  let component: RequestedSettlementFilterComponent;
  let fixture: ComponentFixture<RequestedSettlementFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestedSettlementFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestedSettlementFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
