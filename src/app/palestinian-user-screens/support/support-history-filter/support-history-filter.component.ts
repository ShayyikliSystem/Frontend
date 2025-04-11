import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-support-history-filter',
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
    MatIconModule,
  ],
  templateUrl: './support-history-filter.component.html',
  styleUrl: './support-history-filter.component.scss',
})
export class SupportHistoryFilterComponent {
  @Input() currentFilter: any = { supportArea: '', status: '', date: null };

  @Input() supportAreaOptions: string[] = [
    'CHECKBOOK',
    'CHECK',
    'ENDORSMENT',
    'SETTLEMENT',
    'GENERAL_SETTING',
  ];
  @Input() supportStatusOptions: string[] = ['PENDING', 'RESOLVED'];

  @Output() applyFilter = new EventEmitter<any>();
  @Output() cancelFilter = new EventEmitter<void>();

  filter: any = { ...this.currentFilter };

  ngOnInit(): void {}

  onSubmit(): void {
    this.applyFilter.emit(this.filter);
  }

  onCancel(): void {
    this.cancelFilter.emit();
  }

  transformEnumValue(value: string): string {
    return value
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (match) => match.toUpperCase());
  }
}
