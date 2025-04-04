import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DashboardSidebarComponent } from '../dashboard-sidebar/dashboard-sidebar.component';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [DashboardSidebarComponent, RouterModule],
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.css',
})
export class UserLayoutComponent {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.validateToken().subscribe({
      next: (res) => {
        console.log('Token validation successful:', res);
      },
      error: (err) => {
        console.error('Token validation failed:', err);
        this.router.navigate(['/login']);
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
