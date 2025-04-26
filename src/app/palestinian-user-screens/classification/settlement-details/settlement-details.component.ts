import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SettlementInitiatorDetailsDTO } from '../../../models/settlement.model';
import { LoadingService } from '../../../services/loading.service';
import { SettlementService } from '../../../services/settlement.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-settlement-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatTooltipModule,
  ],
  templateUrl: './settlement-details.component.html',
  styleUrl: './settlement-details.component.scss',
})
export class SettlementDetailsComponent implements OnInit, AfterViewInit {
  @Input() settlementId!: number;
  @Output() close = new EventEmitter<void>();

  displayedColumns = [
    'checkId',
    'transferDate',
    'targetUserName',
    'amount',
    'status',
  ];
  dataSource = new MatTableDataSource<SettlementInitiatorDetailsDTO>();

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private settlementService: SettlementService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.dataSource.sortingDataAccessor = (item, header) => {
      switch (header) {
        case 'transferDate':
          return new Date(item.transferDate);
        case 'amount':
          return item.amount;
        default:
          return (item as any)[header];
      }
    };

    this.loadingService.loadingOn();
    this.settlementService
      .getSettlementDetailsForInitiatorById(this.settlementId)
      .subscribe({
        next: (details) => {
          this.dataSource.data = details;
          this.loadingService.loadingOff();
        },
        error: () => this.loadingService.loadingOff(),
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  formatDate(dateString: string): string {
    return dateString
      ? new Intl.DateTimeFormat('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }).format(new Date(dateString))
      : '–';
  }

  onClose(): void {
    this.close.emit();
  }
}
