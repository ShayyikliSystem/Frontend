import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestIssueCheckFormComponent } from './request-issue-check-form.component';

describe('RequestIssueCheckFormComponent', () => {
  let component: RequestIssueCheckFormComponent;
  let fixture: ComponentFixture<RequestIssueCheckFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestIssueCheckFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestIssueCheckFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
