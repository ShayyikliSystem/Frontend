import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckbookManagementComponent } from './checkbook-management.component';

describe('CheckbookManagementComponent', () => {
  let component: CheckbookManagementComponent;
  let fixture: ComponentFixture<CheckbookManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckbookManagementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckbookManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
