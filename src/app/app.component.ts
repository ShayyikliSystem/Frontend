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

  // list of all your private routes
  private privatePaths = [
    '/dashboard',
    '/checkbook-management',
    '/check-management',
    '/endorsement',
    '/classification',
    '/transaction',
    '/security',
    '/support',
    '/settings',
    '/admin/palestinian',
    '/admin/support',
    '/admin/contacts',
  ];

  constructor(private router: Router, private authService: AuthService) {
    const hasToken = !!localStorage.getItem('authToken');
    const hasRoles = !!localStorage.getItem('userRoles');

    if (hasToken && hasRoles) {
      // only NavigationEnd events that land on a private path
      const navigationOnPrivate$ = this.router.events.pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        filter(() => this.isOnPrivateRoute())
      );

      // only user events when we’re on a private path
      const userEventsOnPrivate$ = merge(
        fromEvent(document, 'click'),
        fromEvent(document, 'keydown'),
        fromEvent(document, 'mousemove')
      ).pipe(filter(() => this.isOnPrivateRoute()));

      // validate whenever either fires
      merge(navigationOnPrivate$, userEventsOnPrivate$)
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
            // only show the timeout dialog if we’re still on a private route
            if (this.isOnPrivateRoute()) {
              this.showTimeout.set(true);
            }
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** helper: checks if the current URL starts with any of your private paths */
  private isOnPrivateRoute(): boolean {
    return this.privatePaths.some((p) => this.router.url.startsWith(p));
  }
}
