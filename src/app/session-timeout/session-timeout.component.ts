import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-session-timeout',
  standalone: true,
  imports: [],
  templateUrl: './session-timeout.component.html',
  styleUrl: './session-timeout.component.scss',
})
export class SessionTimeoutComponent {
  @Output() close = new EventEmitter<void>();

  constructor(private router: Router) {}

  goToLogin(): void {
    this.close.emit();
    this.router.navigate(['/login']);
  }
}
