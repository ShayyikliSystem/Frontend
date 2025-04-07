import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckbookHistoryPanelComponent } from './checkbook-history-panel.component';

describe('CheckbookHistoryPanelComponent', () => {
  let component: CheckbookHistoryPanelComponent;
  let fixture: ComponentFixture<CheckbookHistoryPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckbookHistoryPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckbookHistoryPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
