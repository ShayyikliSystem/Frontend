import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-sidebar.component.html',
  styleUrl: './dashboard-sidebar.component.scss',
})
export class DashboardSidebarComponent {
  activeRoute: string = '';

  menuItems = [
    {
      name: 'Palestinian Management',
      route: 'admin/palestinian',
      icon: 'bank-teller.png',
    },
    { name: 'Support Center', route: 'admin/support', icon: 'technical-support.png' },
    {
      name: 'Contact Requests',
      route: 'admin/contacts',
      icon: 'contact.png',
    },
    { name: 'Logout', route: 'login', icon: 'logout1.png' },
  ];

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activeRoute = event.urlAfterRedirects;
      }
    });
  }

  navigateTo(route: string): void {
    if (route === 'login') {
      localStorage.clear();
      sessionStorage.clear();
    }
    this.router.navigate([route]);
  }
}
