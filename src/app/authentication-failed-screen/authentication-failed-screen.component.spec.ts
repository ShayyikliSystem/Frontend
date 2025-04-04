import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticationFailedScreenComponent } from './authentication-failed-screen.component';

describe('AuthenticationFailedScreenComponent', () => {
  let component: AuthenticationFailedScreenComponent;
  let fixture: ComponentFixture<AuthenticationFailedScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthenticationFailedScreenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthenticationFailedScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
