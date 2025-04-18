import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestIssueCheckPanelComponent } from './request-issue-check-panel.component';

describe('RequestIssueCheckPanelComponent', () => {
  let component: RequestIssueCheckPanelComponent;
  let fixture: ComponentFixture<RequestIssueCheckPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestIssueCheckPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestIssueCheckPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
