import { Component, NgModule } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ConfirmResetComponent } from './confirm-reset/confirm-reset.component';
import { AlertComponent } from '../../alert/alert.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { LoadingService } from '../../services/loading.service';
import { MatButtonModule } from '@angular/material/button';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { NgModel } from '@angular/forms';
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ConfirmResetComponent,
    AlertComponent,
    MatExpansionModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
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
  const isPhoneChanged = this.settingsData.phoneNumber !== this.originalData.phoneNumber;
  
  this.isFormChanged = (isEmailChanged || isPhoneChanged) && 
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
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
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
    // Reset error message
    this.emailError = '';
    
    // Check if empty
    if (!this.settingsData.email) {
      return; // Let Angular handle required validation
    }
  
    // Custom validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.settingsData.email)) {
      this.emailError = 'Invalid email format';
    }
    
    this.checkFormChanges();
  }

  validatePhoneNumber(): void {
    // Remove any non-numeric characters that might have been pasted
    this.settingsData.phoneNumber = this.settingsData.phoneNumber.replace(/\D/g, '');
    
    // Trim to 9 digits if pasted content was longer
    if (this.settingsData.phoneNumber.length > 9) {
      this.settingsData.phoneNumber = this.settingsData.phoneNumber.substring(0, 9);
    }
    
    // Clear previous error
    this.phoneError = '';
    
    // Update validation
    if (!this.settingsData.phoneNumber) {
      this.phoneError = 'Phone number is required.';
    } else if (this.settingsData.phoneNumber.length < 9) {
      this.phoneError = 'Phone number must be exactly 9 digits.';
    }
    
    this.checkFormChanges();
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
    allowOnlyNumbers(event: KeyboardEvent): void {
      const charCode = event.which ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        event.preventDefault();
      }
    }
  
  
  }

   