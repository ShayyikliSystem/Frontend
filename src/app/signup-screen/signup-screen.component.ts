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
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Subject,
  Subscription,
} from 'rxjs';

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

  private _cardInput$ = new Subject<string>();
  private _cardSub!: Subscription;

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

  ngOnInit() {
    this._cardSub = this._cardInput$
      .pipe(
        map((val) => val.replace(/\s+/g, '')),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((raw) => {
        if (raw.length === 16) {
          this.authService
            .checkCardNumber(raw)
            .subscribe((resp) => (this.cardInUse = resp.exists));
        } else {
          this.cardInUse = false;
        }
      });
  }

  ngOnDestroy() {
    this._cardSub.unsubscribe();
  }

  onCardInput(spacedValue: string) {
    this._cardInput$.next(spacedValue);
  }

  date = new FormControl();

  setMonthAndYear(normalizedMonth: moment.Moment, datepicker: any) {
    const selectedDate = normalizedMonth;
    this.signupData.expiryDate = selectedDate.format('MM/YY');
    this.date.setValue(selectedDate);
    datepicker.close();
  }

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
    if (form.invalid) {
      Object.values(form.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }

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
      Object.values(form.controls).forEach((control) => {
        control.markAsTouched();
      });
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
