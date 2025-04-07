import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { Observable, tap } from 'rxjs';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-loading-component',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './loading-component.component.html',
  styleUrl: './loading-component.component.scss',
})
export class LoadingComponentComponent implements OnInit, OnDestroy {
  loading$!: Observable<boolean>;
  private routerSubscription!: Subscription;

  @Input() detectRouteTransitions = false;

  constructor(private loadingService: LoadingService, private router: Router) {}

  ngOnInit() {
    this.loading$ = this.loadingService.loading$;

    if (this.detectRouteTransitions) {
      this.routerSubscription = this.router.events
        .pipe(
          tap((event) => {
            if (event instanceof NavigationStart) {
              this.loadingService.loadingOn();
            } else if (event instanceof NavigationEnd) {
              this.loadingService.loadingOff();
            }
          })
        )
        .subscribe();
    }
  }

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
  }
}
