import { HttpClientModule } from '@angular/common/http';
import { Component, OnDestroy, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { LoadingComponentComponent } from './loading-component/loading-component.component';
import { AuthService } from './services/auth.service';
import { filter, fromEvent, merge, Subject, switchMap, takeUntil } from 'rxjs';
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
export class AppComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  showTimeout = signal(false);

  constructor(private router: Router, private authService: AuthService) {
    const hasToken = !!localStorage.getItem('authToken');
    const hasRoles = !!localStorage.getItem('userRoles');

    if (hasToken && hasRoles) {
      const navigation$ = this.router.events.pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd)
      );

      const userEvents$ = merge(
        fromEvent(document, 'click'),
        fromEvent(document, 'keydown'),
        fromEvent(document, 'mousemove')
      );

      merge(navigation$, userEvents$)
        .pipe(
          takeUntil(this.destroy$),
          switchMap(() => this.authService.validateToken())
        )
        .subscribe({
          next: () => console.log('Token is valid'),
          error: () => {
            console.log('Token expired');
            localStorage.clear();
            sessionStorage.clear();
            this.showTimeout.set(true);
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
