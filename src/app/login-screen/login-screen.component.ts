import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { LoadingService } from '../services/loading.service';
import { CommonModule } from '@angular/common';

import { JwtResponse } from '../models/jwt-response.model';
import { AgreeTermsPolicyRequestComponent } from './agree-terms-policy-request/agree-terms-policy-request.component';

@Component({
  selector: 'app-login-screen',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    AgreeTermsPolicyRequestComponent,
  ],
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.scss'],
})
export class LoginScreenComponent {
  isPasswordVisible = false;
  loginError = '';
  incompleteFormError = '';
  emailError = '';

  showTermsModal = false;
  pendingRoute = '/dashboard';

  loginData = {
    role: 'user',
    shayyikliAccountNumberOrUsername: '',
    password: '',
    locationName: '',
    latitude: '',
    longitude: ''
  };

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private loadingService: LoadingService
  ) { }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ?? event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  resetAccountField(form: NgForm) {
    const currentRole = this.loginData.role;

    this.loginData = {
      role: currentRole,
      shayyikliAccountNumberOrUsername: '',
      password: '',
      locationName: '',
      latitude: '',
      longitude: ''
    };

    form.resetForm({ role: currentRole });
    this.loginData.shayyikliAccountNumberOrUsername = '';
    this.loginData.password = '';
    Object.values(form.controls).forEach((c) => {
      c.setErrors(null);
      c.markAsPristine();
      c.markAsUntouched();
    });
  }

  onSubmit(form: NgForm) {
    this.loadingService.loadingOn();

    if (form.invalid) {
      this.incompleteFormError = 'Check all the required fields.';
      Object.values(form.controls).forEach((c) => c.markAsTouched());
      setTimeout(() => this.loadingService.loadingOff(), 400);
      return;
    }

    this.incompleteFormError = '';
    this.loginError = '';

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          console.log(`Latitude: ${latitude}`);
          console.log(`Longitude: ${longitude}`);

          // 👉 Fetch human-readable location (city/region)
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then(response => response.json())
            .then(data => {
              const address = data.address;
              const countryCode = (address.country_code || '').toUpperCase(); // → "PS"
              const region = address.region || address.state || '';
              const area = address.city ||address.county ||  address.town || address.village || '';

              const a=address
              // Join the parts, filter out empty strings
              const locationName = [countryCode, region, area].filter(part => part).join(', ');

              console.log('✅ User Location Area:');
              console.log(address);
              console.log(`Location: ${locationName}`);
              console.log(`Country: ${address.country}`);

              // 👉 NOW BUILD THE LOGIN REQUEST OBJECT
              const loginRequest = {
                ...this.loginData,
                latitude,
                longitude,
                locationName, // 👈 add locationName from reverse geocoding
              };

              // 👉 NOW submit login
              this.submitLogin(loginRequest);
            })
            .catch(error => {
              console.error('❌ Error fetching location details:', error);

              // If reverse geocoding fails, proceed with basic lat/lon
              const loginRequest = {
                ...this.loginData,
                latitude,
                longitude,
              };
              this.submitLogin(loginRequest);
            });
        },
        (error) => {
          console.error('Error getting location:', error);
          // If user blocks location, login without location info
          this.submitLogin(this.loginData);
        }
      );
    } else {
      console.error('Geolocation not supported');
      this.submitLogin(this.loginData);
    }
  }

  private submitLogin(loginRequest: any) {
    this.authService.login(loginRequest).subscribe({
      next: (response: JwtResponse) => {
        if (response.roles.includes('ROLE_ADMIN')) {
          this.router.navigate(['/admin/dashboard']);
          this.loadingService.loadingOff();
          return;
        }

        this.pendingRoute = '/dashboard';
        this.userService
          .getAgreeStatus(response.shayyikliAccountNumber)
          .subscribe({
            next: (agreed: boolean) => {
              this.loadingService.loadingOff();
              if (agreed) {
                this.router.navigate([this.pendingRoute]);
              } else {
                this.showTermsModal = true;
              }
            },
            error: () => {
              this.loadingService.loadingOff();
              this.showTermsModal = true;
            },
          });
      },
      error: () => {
        this.loginError = 'The credentials are incorrect.';
        setTimeout(() => this.loadingService.loadingOff(), 400);
      },
    });
  }

  onTermsAgreed() {
    const acct = Number(localStorage.getItem('shayyikliAccountNumber'));
    this.userService.agreeToTerms(acct).subscribe({
      next: () => {
        this.showTermsModal = false;
        this.router.navigate([this.pendingRoute]);
      },
      error: (e: any) => console.error('Could not record agreement', e),
    });
  }

  validateEmail(ctrl: NgModel) {
    const v = ctrl.value ?? '';
    this.emailError =
      v && !/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(v)
        ? 'Invalid email format'
        : '';
  }
}
