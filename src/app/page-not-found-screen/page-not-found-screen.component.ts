import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-page-not-found-screen',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './page-not-found-screen.component.html',
  styleUrl: './page-not-found-screen.component.scss',
})
export class PageNotFoundScreenComponent {
  constructor(private authService: AuthService, private router: Router) {}

  goBack(): void {
    if (this.authService.isLoggedIn()) {
      const rolesString = localStorage.getItem('userRoles');
      const roles: string[] = rolesString ? JSON.parse(rolesString) : [];

      if (roles.includes('ROLE_ADMIN')) {
        this.router.navigate(['/admin/dashboard']);
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
