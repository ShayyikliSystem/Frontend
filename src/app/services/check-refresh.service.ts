import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckRefreshService {
  private refreshSource = new Subject<void>();

  refresh$ = this.refreshSource.asObservable();

  refreshTables(): void {
    this.refreshSource.next();
  }
}
