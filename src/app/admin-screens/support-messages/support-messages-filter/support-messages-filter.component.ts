import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-support-messages-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './support-messages-filter.component.html',
  styleUrl: './support-messages-filter.component.scss',
})
export class SupportMessagesFilterComponent {
  @Input() supportAreas: string[] = [];
  @Input() statusOptions: string[] = [];
  @Input() currentFilter = {
    supportArea: '',
    status: '',
    date: null as Date | null,
  };
  @Output() applyFilter = new EventEmitter<typeof this.currentFilter>();
  @Output() cancelFilter = new EventEmitter<void>();

  filter = { ...this.currentFilter };

  onSubmit() {
    this.applyFilter.emit(this.filter);
  }
  onCancel() {
    this.cancelFilter.emit();
  }

  transformEnumValue(value: string): string {
    return value
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
}
