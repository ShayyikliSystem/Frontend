import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupSuccessScreenComponent } from './signup-success-screen.component';

describe('SignupSuccessScreenComponent', () => {
  let component: SignupSuccessScreenComponent;
  let fixture: ComponentFixture<SignupSuccessScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupSuccessScreenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupSuccessScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
