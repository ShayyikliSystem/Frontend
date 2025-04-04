import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-admin-screen',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-admin-screen.component.html',
  styleUrl: './dashboard-admin-screen.component.css',
})
export class DashboardAdminScreenComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
