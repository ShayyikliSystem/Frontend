import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-request-checkbook',
  standalone: true,
  imports: [],
  templateUrl: './request-checkbook.component.html',
  styleUrl: './request-checkbook.component.scss',
})
export class RequestCheckbookComponent {
  @Output() confirmRequest = new EventEmitter<void>();
  @Output() cancelRequest = new EventEmitter<void>();

  requestCheckbook(): void {
    this.confirmRequest.emit();
  }

  cancel(): void {
    this.cancelRequest.emit();
  }
}
