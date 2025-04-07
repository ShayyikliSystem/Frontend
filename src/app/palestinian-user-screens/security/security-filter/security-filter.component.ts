import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-security-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    ReactiveFormsModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatAutocompleteModule,
  ],
  templateUrl: './security-filter.component.html',
  styleUrl: './security-filter.component.scss',
})
export class SecurityFilterComponent {
  @Input() filterStatus: string = '';
  @Input() filterDate: Date | null = null;

  @Output() applyFilterEvent = new EventEmitter<{
    status: string;
    date: Date | null;
  }>();

  @Output() cancelFilterEvent = new EventEmitter<void>();

  applyFilter(): void {
    this.applyFilterEvent.emit({
      status: this.filterStatus,
      date: this.filterDate,
    });
  }

  onSubmit(): void {
    this.applyFilter();
  }

  onCancel(): void {
    this.cancelFilterEvent.emit();
  }
}
