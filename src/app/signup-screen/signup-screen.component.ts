import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';

import {
  FormControl,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { default as _rollupMoment } from 'moment';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_FORMATS } from '../formats/my-date-formats';
import _moment from 'moment';
import { SignupRequest } from '../models/signup-request.model';
import { LoadingService } from '../services/loading.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-signup-screen',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDatepickerModule,
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  templateUrl: './signup-screen.component.html',
  styleUrl: './signup-screen.component.scss',
})
export class SignupScreenComponent {
  submitted: boolean = false;
  signupError: string = '';
  cardInUse = false;
  public signupData: SignupRequest = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    idNumber: null,
    cardNumber: '',
    expiryDate: '',
    securityCode: null,
    agreedToTerms: false,
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private loadingService: LoadingService
  ) {}

  date = new FormControl();

  setMonthAndYear(normalizedMonth: moment.Moment, datepicker: any) {
    const selectedDate = normalizedMonth;
    this.signupData.expiryDate = selectedDate.format('MM/YY');
    this.date.setValue(selectedDate);
    datepicker.close();
  }
  /** Call on blur of card‐input */
  onCardBlur(): void {
    const raw = this.signupData.cardNumber.replace(/\s+/g, '');
    if (raw.length === 16) {
      this.authService.checkCardNumber(raw).subscribe((resp) => {
        this.cardInUse = resp.exists;
      });
    } else {
      this.cardInUse = false;
    }
  }
  public onCreateAccount(form: NgForm): void {
    // prevent submission if card is in use
    if (this.cardInUse) {
      this.signupError = 'Card number already has an account in Shayyikli!';
      setTimeout(() => {
        this.loadingService.loadingOff();
      }, 400);
      return;
    }
    this.submitted = true;
    this.loadingService.loadingOn();

    if (this.signupData.cardNumber) {
      this.signupData.cardNumber = this.signupData.cardNumber.replace(
        /\s/g,
        ''
      );
    }

    if (
      !this.signupData.firstName ||
      !this.signupData.lastName ||
      !this.signupData.email ||
      !this.signupData.phoneNumber ||
      !this.signupData.idNumber ||
      !this.signupData.cardNumber ||
      !this.signupData.expiryDate ||
      !this.signupData.securityCode
    ) {
      this.signupError = 'Please fill out all required fields.';
      setTimeout(() => {
        this.loadingService.loadingOff();
      }, 400);
      return;
    }

    if (!this.signupData.agreedToTerms) {
      this.signupError = 'You must agree to the terms.';
      setTimeout(() => {
        this.loadingService.loadingOff();
      }, 400);
      return;
    }

    const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailPattern.test(this.signupData.email)) {
      this.signupError = 'Please enter a valid email address.';
      setTimeout(() => {
        this.loadingService.loadingOff();
      }, 400);
      return;
    }

    const phonePattern = /^\d{9}$/;
    const idPattern = /^\d{9}$/;
    const cardPattern = /^\d{16}$/;
    const securityPattern = /^\d{3}$/;

    if (!phonePattern.test(this.signupData.phoneNumber)) {
      this.signupError = 'Phone number must be exactly 9 digits.';
      setTimeout(() => {
        this.loadingService.loadingOff();
      }, 400);
      return;
    }

    if (!idPattern.test(this.signupData.idNumber.toString())) {
      this.signupError = 'ID number must be exactly 9 digits.';
      setTimeout(() => {
        this.loadingService.loadingOff();
      }, 400);
      return;
    }
    if (!cardPattern.test(this.signupData.cardNumber.replace(/\s/g, ''))) {
      this.signupError = 'Card number must be exactly 16 digits.';
      setTimeout(() => {
        this.loadingService.loadingOff();
      }, 400);
      return;
    }

    if (!securityPattern.test(this.signupData.securityCode.toString())) {
      this.signupError = 'Security code must be exactly 3 digits.';
      setTimeout(() => {
        this.loadingService.loadingOff();
      }, 400);
      return;
    }

    const fullPhoneNumber = '+970' + this.signupData.phoneNumber;
    const submissionData: SignupRequest = {
      ...this.signupData,
      phoneNumber: fullPhoneNumber,
    };

    this.authService.signup(submissionData).subscribe({
      next: (response) => {
        const maskedEmail = this.maskEmail(this.signupData.email);
        localStorage.setItem('signupEmail', maskedEmail);
        this.router.navigate(['/signup-success']);
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
      error: (error) => {
        console.error('Signup error:', error);
        if (
          error.status === 404 &&
          error.error &&
          error.error.message &&
          error.error.message.indexOf('Bank account verification failed!') !==
            -1
        ) {
          this.signupError =
            'The bank info is not valid. Ensure all details are correct according to your bank card.';
        } else if (error.error && error.error.message) {
          this.signupError = error.error.message;
        } else {
          this.signupError =
            'An unexpected error occurred. Please try again later.';
        }
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
    });
  }

  public maskEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    let maskedLocal = localPart;
    if (localPart.length > 2) {
      maskedLocal = localPart.substring(0, 2) + '***';
    }
    return `${maskedLocal}@${domain}`;
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }

  formatCardNumber(event: any): void {
    let input = event.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formattedInput = input.match(/.{1,4}/g)?.join(' ') || '';
    this.signupData.cardNumber = formattedInput;
  }

  allowOnlyLetters(event: KeyboardEvent): void {
    const char = event.key;
    if (!/^[a-zA-Z _-]$/.test(char)) {
      event.preventDefault();
    }
  }
}
