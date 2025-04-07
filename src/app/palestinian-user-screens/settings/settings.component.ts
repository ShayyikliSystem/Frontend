import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ConfirmResetComponent } from './confirm-reset/confirm-reset.component';
import { AlertComponent } from '../../alert/alert.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ConfirmResetComponent,
    AlertComponent,
    MatExpansionModule,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  settingsData = {
    email: '',
    phoneNumber: '',
  };

  originalData = {
    email: '',
    phoneNumber: '',
  };

  isFormChanged: boolean = false;
  showResetPassword: boolean = false;

  emailError: string = '';
  phoneError: string = '';

  alertMessage = '';
  alertType: 'success' | 'error' = 'success';

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  showAlert(message: string, type: 'success' | 'error' = 'success'): void {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => (this.alertMessage = ''), 5000);
  }

  checkFormChanges(): void {
    const isEmailChanged = this.settingsData.email !== this.originalData.email;
    const isPhoneChanged =
      this.settingsData.phoneNumber !== this.originalData.phoneNumber;

    this.validateEmail();
    this.validatePhoneNumber();

    this.isFormChanged =
      (isEmailChanged || isPhoneChanged) &&
      !this.emailError &&
      !this.phoneError;
  }

  onResetPassword(): void {
    this.showResetPassword = true;
  }

  confirmResetPassword(): void {
    this.loadingService.loadingOn();
    this.showResetPassword = false;

    this.authService.resetPasswordForProfile().subscribe({
      next: () => {
        this.showAlert(
          'Your password has been reset successfully! Logging out in 5 seconds...',
          'success'
        );
        this.loadingService.loadingOff();
        setTimeout(() => {
          this.authService.logout();
        }, 5000);
      },
      error: (err) => {
        console.error('Password reset failed', err);
        this.showAlert(
          'Error resetting password: ' +
            (err.error?.message || 'Something went wrong'),
          'error'
        );
        this.loadingService.loadingOff();
      },
    });
  }

  cancelResetPassword(): void {
    this.showResetPassword = false;
  }

  loadUserProfile(): void {
    this.loadingService.loadingOn();
    this.authService.getUserProfile().subscribe({
      next: (data) => {
        this.settingsData.email = data.email;
        this.settingsData.phoneNumber = data.phoneNumber.startsWith('+970')
          ? data.phoneNumber.slice(4)
          : data.phoneNumber;
        this.originalData = { ...this.settingsData };
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
      error: (err) => {
        console.error('Failed to load user profile', err);
        this.showAlert('Failed to load user profile', 'error');
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
    });
  }

  validateEmail(): void {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!this.settingsData.email) {
      this.emailError = 'Email is required.';
    } else if (!emailPattern.test(this.settingsData.email)) {
      this.emailError = 'Invalid email format.';
    } else {
      this.emailError = '';
    }
  }

  validatePhoneNumber(): void {
    const phonePattern = /^\d{9}$/;
    if (!this.settingsData.phoneNumber) {
      this.phoneError = 'Phone number is required.';
    } else if (!phonePattern.test(this.settingsData.phoneNumber)) {
      this.phoneError = 'Phone number must be exactly 9 digits.';
    } else {
      this.phoneError = '';
    }
  }

  onSaveSettings(): void {
    this.loadingService.loadingOn();

    if (this.emailError || this.phoneError) {
      return;
    }

    let formattedPhoneNumber = this.settingsData.phoneNumber.startsWith('+970')
      ? this.settingsData.phoneNumber
      : '+970' + this.settingsData.phoneNumber;

    this.authService
      .updateProfile(this.settingsData.email, formattedPhoneNumber)
      .subscribe({
        next: (response) => {
          this.showAlert('Profile updated successfully!', 'success');
          if (response.newToken) {
            localStorage.setItem('authToken', response.newToken);
          }
          this.originalData = { ...this.settingsData };
          this.isFormChanged = false;
          setTimeout(() => {
            this.loadingService.loadingOff();
          }, 400);
        },
        error: (err) => {
          console.error('Update failed', err);
          this.showAlert(
            'Error updating profile: ' +
              (err.error?.message || 'Something went wrong'),
            'error'
          );
          setTimeout(() => {
            this.loadingService.loadingOff();
          }, 400);
        },
      });
  }
}
