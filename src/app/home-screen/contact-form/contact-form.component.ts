import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css',
})
export class ContactFormComponent {
  submitted: boolean = false;
  contactForm: FormGroup;

  @Output() alertMessageEvent = new EventEmitter<{
    message: string;
    type: 'success' | 'error';
  }>();

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private loadingService: LoadingService
  ) {
    this.contactForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
        message: ['', Validators.required],
      },
      { updateOn: 'submit' }
    );
  }

  showAlert(message: string, type: 'success' | 'error' = 'success'): void {
    this.alertMessageEvent.emit({ message, type });
  }

  get email() {
    return this.contactForm.get('email')!;
  }
  get phoneNumber() {
    return this.contactForm.get('phoneNumber')!;
  }
  get firstName() {
    return this.contactForm.get('firstName')!;
  }
  get lastName() {
    return this.contactForm.get('lastName')!;
  }
  get message() {
    return this.contactForm.get('message')!;
  }

  onSubmit() {
    this.submitted = true;
    if (this.contactForm.invalid) {
      return;
    }
    const formValue = this.contactForm.value;
    const formattedPhoneNumber = '+970' + formValue.phoneNumber;
    const submissionData = { ...formValue, phoneNumber: formattedPhoneNumber };

    this.loadingService.loadingOn();
    this.contactService.createContact(submissionData).subscribe({
      next: () => {
        this.showAlert('Your message has been sent successfully!', 'success');
        this.contactForm.reset();
        Object.keys(this.contactForm.controls).forEach((key) => {
          const control = this.contactForm.get(key);
          control?.setErrors(null);
          control?.markAsPristine();
          control?.markAsUntouched();
        });
        this.submitted = false;
        this.loadingService.loadingOff();
      },

      error: (error) => {
        console.error('Error submitting contact:', error);
        this.showAlert('Failed to send message. Please try again.', 'error');
        this.loadingService.loadingOff();
      },
    });
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }
}
