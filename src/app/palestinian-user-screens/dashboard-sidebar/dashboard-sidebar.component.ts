import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-sidebar.component.html',
  styleUrl: './dashboard-sidebar.component.css',
})
export class DashboardSidebarComponent {
  activeRoute: string = '';
  userRole: string = '';

  menuItems = [
    { name: 'Dashboard', route: 'dashboard', icon: 'dashboard1.png' },
    {
      name: 'Check Management',
      route: 'check-management',
      icon: 'check-management1.png',
    },
    {
      name: 'Endorsement (JIRO)',
      route: 'endorsement',
      icon: 'endorsment1.png',
    },
    {
      name: 'Classification & Settlement',
      route: 'classification',
      icon: 'classification1.png',
    },
    { name: 'Transaction', route: 'transaction', icon: 'transaction1.png' },
    { name: 'Security & Alerts', route: 'security', icon: 'security1.png' },
    { name: 'Settings', route: 'settings', icon: 'settings1.png' },
    { name: 'logout', route: 'login', icon: 'logout1.png' },
  ];

  constructor(private router: Router, private authService: AuthService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activeRoute = event.urlAfterRedirects.split('/').pop() || '';
      }
    });
    this.userRole = this.authService.getUserRole();
  }

  navigateTo(route: string): void {
    if (route === 'login') {
      this.authService.logout();
      this.router.navigate([route]);
    } else {
      this.router.navigate([route]);
    }
  }

  goToDashboard(): void {
    this.router.navigate(['dashboard']);
  }
}
