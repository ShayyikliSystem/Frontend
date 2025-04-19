import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentSettlementFilterComponent } from './current-settlement-filter.component';

describe('CurrentSettlementFilterComponent', () => {
  let component: CurrentSettlementFilterComponent;
  let fixture: ComponentFixture<CurrentSettlementFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentSettlementFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentSettlementFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
