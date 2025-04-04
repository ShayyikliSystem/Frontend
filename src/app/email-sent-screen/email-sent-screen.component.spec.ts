import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailSentScreenComponent } from './email-sent-screen.component';

describe('EmailSentScreenComponent', () => {
  let component: EmailSentScreenComponent;
  let fixture: ComponentFixture<EmailSentScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailSentScreenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailSentScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
