import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettlementRefreshService {
  private refreshTrigger = new Subject<void>();

  refresh$ = this.refreshTrigger.asObservable();

  triggerRefresh(): void {
    this.refreshTrigger.next();
  }
}
