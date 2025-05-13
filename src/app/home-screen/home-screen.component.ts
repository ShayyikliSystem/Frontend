import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../alert/alert.component';
import { UserService } from '../services/user.service';
import { LoadingService } from '../services/loading.service';
import { AgreeTermsPolicyRequestComponent } from '../login-screen/agree-terms-policy-request/agree-terms-policy-request.component';

@Component({
  selector: 'app-home-screen',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ContactFormComponent,
    AlertComponent,
    AgreeTermsPolicyRequestComponent,
  ],
  templateUrl: './home-screen.component.html',
  styleUrl: './home-screen.component.scss',
})
export class HomeScreenComponent {
  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';

  showTermsModal = false;
  pendingRoute = '/dashboard';

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private loadingService: LoadingService
  ) {}

  handleAlert(event: { message: string; type: 'success' | 'error' }): void {
    this.alertMessage = event.message;
    this.alertType = event.type;
    setTimeout(() => (this.alertMessage = ''), 5000);
  }

  scrollToFragment(fragment: string) {
    this.router.navigate([], { fragment }).then(() => {
      const element = document.getElementById(fragment);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  navigateDigitiseNow(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const roles: string[] = JSON.parse(
      localStorage.getItem('userRoles') || '[]'
    );
    if (roles.includes('ROLE_ADMIN')) {
      this.router.navigate(['/admin']);
      return;
    }

    this.loadingService.loadingOn();
    this.pendingRoute = '/dashboard';

    const acct = Number(localStorage.getItem('shayyikliAccountNumber'));
    this.userService.getAgreeStatus(acct).subscribe({
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
  }

  onTermsAgreed(): void {
    const acct = Number(localStorage.getItem('shayyikliAccountNumber'));
    this.loadingService.loadingOn();
    this.userService.agreeToTerms(acct).subscribe({
      next: () => {
        this.loadingService.loadingOff();
        this.showTermsModal = false;
        this.router.navigate([this.pendingRoute]);
      },
      error: () => {
        this.loadingService.loadingOff();
      },
    });
  }
}
