import { LoadingService } from './../services/loading.service';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-forgot-password-screen',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './forgot-password-screen.component.html',
  styleUrl: './forgot-password-screen.component.scss',
})
export class ForgotPasswordScreenComponent {
  email: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private loadingService: LoadingService
  ) {}

  
  onSubmit(form: NgForm): void {
    this.loadingService.loadingOn();

  
    if (form.invalid) {
      Object.values(form.controls).forEach((control) =>
        control.markAsTouched()
      );
      setTimeout(() => {
        this.loadingService.loadingOff();
      }, 400);
      return;
    }
    this.authService.resetPassword(this.email).subscribe({
      next: () => {
        const maskedEmail = this.maskEmail(this.email);
        localStorage.setItem('resetEmail', maskedEmail);
        this.router.navigate(['/email-sent']);
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
      error: (error) => {
        console.error('Reset password error:', error);
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
    });
  }

  maskEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    let maskedLocal = localPart;
    if (localPart.length > 2) {
      maskedLocal = localPart.substring(0, 2) + '***';
    }
    return `${maskedLocal}@${domain}`;
  }
}
