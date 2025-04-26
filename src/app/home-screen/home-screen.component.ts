import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-home-screen',
  standalone: true,
  imports: [CommonModule, RouterModule, ContactFormComponent, AlertComponent],
  templateUrl: './home-screen.component.html',
  styleUrl: './home-screen.component.scss',
})
export class HomeScreenComponent {
  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';

  constructor(private router: Router, private authService: AuthService) {}

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
    if (this.authService.isLoggedIn()) {
      const rolesString = localStorage.getItem('userRoles');
      const roles: string[] = rolesString ? JSON.parse(rolesString) : [];

      console.log('User roles:', roles);
      if (!roles) {
        this.router.navigate(['/login']);
      } else if (roles.includes('ROLE_ADMIN')) {
        this.router.navigate(['/admin/palestinian']);
      } else if (roles.includes('ROLE_PALESTINIAN')) {
        this.router.navigate(['/dashboard']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
}
