import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorySettlmentPanelComponent } from './history-settlment-panel.component';

describe('HistorySettlmentPanelComponent', () => {
  let component: HistorySettlmentPanelComponent;
  let fixture: ComponentFixture<HistorySettlmentPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorySettlmentPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorySettlmentPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
