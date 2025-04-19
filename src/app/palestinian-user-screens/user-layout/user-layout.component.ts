import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DashboardSidebarComponent } from '../dashboard-sidebar/dashboard-sidebar.component';
@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [DashboardSidebarComponent, RouterModule],
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.scss',
})
export class UserLayoutComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
