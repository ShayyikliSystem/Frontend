import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../services/user.service';
import { RouterModule, Router } from '@angular/router';


@Component({

  selector: 'app-agree-terms-policy-request',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterModule],
  templateUrl: './agree-terms-policy-request.component.html',
  styleUrls: ['./agree-terms-policy-request.component.scss']
})
export class AgreeTermsPolicyRequestComponent implements OnInit {
  @Output() agreed = new EventEmitter<void>();
  accountNumber?: number;
  pendingRoute = '/dashboard';
  constructor(private userService: UserService,private router: Router) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe({
      next: user => this.accountNumber = user.shayyikliAccountNumber,
      error: (e: any) => console.error('Could not load user', e)
    });
  }

  onAgree() {
    if (!this.accountNumber) { return; }
    this.pendingRoute = '/dashboard';
    this.userService.agreeToTerms(this.accountNumber).subscribe({
      next: () =>
      // this.agreed.emit(),
      this.router.navigate([this.pendingRoute]),
      error: (err: any) => console.error('Agreement failed', err)
    });
  }
}
