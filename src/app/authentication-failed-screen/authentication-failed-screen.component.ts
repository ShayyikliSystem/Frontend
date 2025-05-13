import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-authentication-failed-screen',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './authentication-failed-screen.component.html',
  styleUrl: './authentication-failed-screen.component.scss',
})
export class AuthenticationFailedScreenComponent {
  constructor(private authService: AuthService, private router: Router) {}

  goBack(): void {
    if (this.authService.isLoggedIn()) {
      const rolesString = localStorage.getItem('userRoles');
      const roles: string[] = rolesString ? JSON.parse(rolesString) : [];

      if (roles.includes('ROLE_ADMIN')) {
        this.router.navigate(['/admin']);
      } else if (roles.includes('ROLE_PALESTINIAN')) {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
}
