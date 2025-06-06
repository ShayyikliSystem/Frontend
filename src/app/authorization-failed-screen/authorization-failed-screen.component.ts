import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-authorization-failed-screen',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './authorization-failed-screen.component.html',
  styleUrl: './authorization-failed-screen.component.scss',
})
export class AuthorizationFailedScreenComponent {
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
