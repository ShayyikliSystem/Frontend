import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcoming-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcoming-screen.component.html',
  styleUrl: './welcoming-screen.component.scss',
})
export class WelcomingScreenComponent {
  currentDate = new Date();

  constructor(private router: Router) {}

  navigateTo(path: string) {
    this.router.navigate(['admin', path]);
  }
}
