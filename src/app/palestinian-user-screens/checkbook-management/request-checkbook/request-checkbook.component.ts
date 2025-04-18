import { Component, EventEmitter, Output } from '@angular/core';
import { CheckbookService } from '../../../services/checkbook.service';
import { LoadingService } from '../../../services/loading.service';
import { CheckRefreshService } from '../../../services/check-refresh.service';

@Component({
  selector: 'app-request-checkbook',
  standalone: true,
  imports: [],
  templateUrl: './request-checkbook.component.html',
  styleUrl: './request-checkbook.component.scss',
})
export class RequestCheckbookComponent {
  @Output() requestCompleted = new EventEmitter<void>();
  @Output() cancelRequest = new EventEmitter<void>();

  constructor(
    private checkbookService: CheckbookService,
    private loadingService: LoadingService,
    private checkRefreshService: CheckRefreshService
  ) {}

  requestCheckbook(): void {
    this.loadingService.loadingOn();
    this.checkbookService.requestCheckbook().subscribe({
      next: (response) => {
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
        this.checkRefreshService.refreshTables();
        this.requestCompleted.emit();
      },
      error: (err) => {
        console.error('Error requesting checkbook', err);
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
    });
  }

  cancel(): void {
    this.cancelRequest.emit();
  }
}
