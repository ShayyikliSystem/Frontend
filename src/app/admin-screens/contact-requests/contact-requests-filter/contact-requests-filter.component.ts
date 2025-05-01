import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-contact-requests-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './contact-requests-filter.component.html',
  styleUrl: './contact-requests-filter.component.scss',
})
export class ContactRequestsFilterComponent {
  @Input() statusOptions: string[] = [];
  @Input() currentStatus = '';
  @Output() applyFilter = new EventEmitter<string>();
  @Output() cancelFilter = new EventEmitter<void>();

  filterStatus = this.currentStatus;

  ngOnInit() {
    this.filterStatus = this.currentStatus;
  }

  onApply() {
    this.applyFilter.emit(this.filterStatus);
  }
  onCancel() {
    this.cancelFilter.emit();
  }

  transformEnumValue(value: string) {
    const txt = value.replace(/_/g, ' ').toLowerCase();
    return txt.charAt(0).toUpperCase() + txt.slice(1);
  }
}
