import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-reset',
  standalone: true,
  imports: [],
  templateUrl: './confirm-reset.component.html',
  styleUrl: './confirm-reset.component.css',
})
export class ConfirmResetComponent {
  @Output() confirmReset = new EventEmitter<void>();
  @Output() cancelReset = new EventEmitter<void>();

  confirmPassword(): void {
    this.confirmReset.emit();
  }

  cancel(): void {
    this.cancelReset.emit();
  }
}
