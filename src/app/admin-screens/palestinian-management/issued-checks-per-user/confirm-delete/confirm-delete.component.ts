import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-delete',
  standalone: true,
  imports: [],
  templateUrl: './confirm-delete.component.html',
  styleUrl: './confirm-delete.component.scss',
})
export class ConfirmDeleteComponent {
  @Input() checkId!: number;
  @Output() confirmDelete = new EventEmitter<number>();
  @Output() cancelDelete = new EventEmitter<void>();

  onCancel() {
    this.cancelDelete.emit();
  }

  onConfirm() {
    this.confirmDelete.emit(this.checkId);
  }
}
