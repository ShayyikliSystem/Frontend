import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportHistoryPanelComponent } from './support-history-panel.component';

describe('SupportHistoryPanelComponent', () => {
  let component: SupportHistoryPanelComponent;
  let fixture: ComponentFixture<SupportHistoryPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportHistoryPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SupportHistoryPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
