import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup-success-screen',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './signup-success-screen.component.html',
  styleUrl: './signup-success-screen.component.scss',
})
export class SignupSuccessScreenComponent {
  signupEmail: string = '';

  constructor(private router: Router) {
    this.signupEmail = localStorage.getItem('signupEmail') || '';
  }

  backToLogin(): void {
    this.router.navigate(['/login']);
  }
}
