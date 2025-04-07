import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckRefreshService {
  // Subject to broadcast refresh events
  private refreshSource = new Subject<void>();

  // Observable that panels can subscribe to
  refresh$ = this.refreshSource.asObservable();

  // Method to trigger a refresh event
  refreshTables(): void {
    this.refreshSource.next();
  }
}
