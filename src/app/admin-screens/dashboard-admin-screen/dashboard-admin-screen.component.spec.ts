import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAdminScreenComponent } from './dashboard-admin-screen.component';

describe('DashboardAdminScreenComponent', () => {
  let component: DashboardAdminScreenComponent;
  let fixture: ComponentFixture<DashboardAdminScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAdminScreenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardAdminScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
