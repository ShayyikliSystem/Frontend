import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSettlementPanelComponent } from './create-settlement-panel.component';

describe('CreateSettlementPanelComponent', () => {
  let component: CreateSettlementPanelComponent;
  let fixture: ComponentFixture<CreateSettlementPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSettlementPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateSettlementPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
