import { HttpClientModule } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoadingComponentComponent } from './loading-component/loading-component.component';
import { AuthService } from './services/auth.service';
import { interval, Subscription, switchMap } from 'rxjs';
import { SessionTimeoutComponent } from './session-timeout/session-timeout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HttpClientModule,
    LoadingComponentComponent,
    SessionTimeoutComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Shayyikli-System';
  showTimeout = false;
  private tokenCheckSub!: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (
      localStorage.getItem('authToken') &&
      localStorage.getItem('userRoles')
    ) {
      this.tokenCheckSub = interval(1)
        .pipe(switchMap(() => this.authService.validateToken()))
        .subscribe({
          next: () => {},
          error: () => {
            this.tokenCheckSub.unsubscribe();
            localStorage.removeItem('authToken');
            localStorage.removeItem('userRoles');
            sessionStorage.clear();
            this.showTimeout = true;
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.tokenCheckSub?.unsubscribe();
  }
}
