import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { JwtResponse } from '../models/jwt-response.model';

@Component({
  selector: 'app-login-screen',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './login-screen.component.html',
  styleUrl: './login-screen.component.css',
})
export class LoginScreenComponent {
  isPasswordVisible: boolean = false;
  loginError: string = '';
  incompleteFormError: string = '';

  loginData = {
    role: 'user',
    shayyikliAccountNumberOrUsername: '',
    password: '',
  };

  constructor(private authService: AuthService, private router: Router) {}

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  allowOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  resetAccountField(form: NgForm): void {
    this.loginData.shayyikliAccountNumberOrUsername = '';
    this.loginData.password = '';

    Object.keys(form.controls).forEach((key) => {
      const control = form.controls[key];
      control?.setErrors(null);
      control?.markAsPristine();
      control?.markAsUntouched();
    });
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      this.incompleteFormError = 'Check all the required fields.';
      Object.values(form.controls).forEach((control) =>
        control.markAsTouched()
      );
      return;
    }
    this.incompleteFormError = '';

    this.loginError = '';

    this.authService.login(this.loginData).subscribe({
      next: (response: JwtResponse) => {
        if (response.roles.includes('ROLE_ADMIN')) {
          this.router.navigate(['/admin/dashboard']);
        } else if (response.roles.includes('ROLE_PALESTINIAN')) {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (error) => {
        console.error('Login failed', error);
        this.loginError = 'The credentials are incorrect.';
      },
    });
  }
}
