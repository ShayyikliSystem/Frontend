import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizationFailedScreenComponent } from './authorization-failed-screen.component';

describe('AuthorizationFailedScreenComponent', () => {
  let component: AuthorizationFailedScreenComponent;
  let fixture: ComponentFixture<AuthorizationFailedScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorizationFailedScreenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorizationFailedScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
