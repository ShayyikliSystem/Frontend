import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordScreenComponent } from './forgot-password-screen.component';

describe('ForgotPasswordScreenComponent', () => {
  let component: ForgotPasswordScreenComponent;
  let fixture: ComponentFixture<ForgotPasswordScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordScreenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
