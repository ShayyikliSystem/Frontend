import { SettlementService } from './../../../services/settlement.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LoadingService } from '../../../services/loading.service';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-history-settlment-panel',
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
  templateUrl: './history-settlment-panel.component.html',
  styleUrl: './history-settlment-panel.component.scss',
})
export class HistorySettlmentPanelComponent implements OnInit, AfterViewInit {
  settlementDisplayedColumns: string[] = [
    'id',
    'previousClassification',
    'newClassification',
    'createdAt',
    'responseAt',
    'status',
  ];
  settlementDataSource = new MatTableDataSource<any>();
  dynamicPageSizeOptions: number[] = [5, 10, 15];
  classification: any = 'N/A';
  hasActiveCheckbook: boolean = false;

  @ViewChild(MatSort) set sort(ms: MatSort) {
    this.settlementDataSource.sort = ms;
    if (this.settlementDataSource.paginator) {
      this.settlementDataSource.paginator.firstPage();
    }
  }

  @ViewChild(MatPaginator) set paginator(mp: MatPaginator) {
    this.settlementDataSource.paginator = mp;
  }

  constructor(
    private settlementService: SettlementService,
    private loadingService: LoadingService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.fetchSettlementHistory();
  }

  loadUserData(): void {
    this.loadingService.loadingOn();

    this.userService.getUserClassification().subscribe({
      next: (data) => {
        this.classification = data;
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
      error: (err) => {
        console.error('Error fetching classification', err);
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
    });
  }

  ngAfterViewInit(): void {
    this.settlementDataSource.sort = this.sort;
    this.settlementDataSource.paginator = this.paginator;
  }

  fetchSettlementHistory(): void {
    this.loadingService.loadingOn();
    this.settlementService
      .getRequestedSettlementHistoryForInitiator()
      .subscribe({
        next: (data) => {
          console.log('Settlement history data:', data);
          const history = Array.isArray(data) ? data : [];
          history.sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          this.settlementDataSource.data = history;
          this.updatePageSizeOptions();
          setTimeout(() => {
            this.loadingService.loadingOff();
          }, 400);
        },
        error: (err) => {
          console.error('Error fetching settlement history', err);
          setTimeout(() => {
            this.loadingService.loadingOff();
          }, 400);
        },
      });
  }

  updatePageSizeOptions(): void {
    const count = this.settlementDataSource.filteredData.length;
    this.dynamicPageSizeOptions =
      count < 5
        ? [count]
        : [...Array(Math.ceil(count / 5)).keys()]
            .map((i) => (i + 1) * 5)
            .concat(count % 5 ? [count] : [])
            .filter((v, i, a) => a.indexOf(v) === i);
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Invalid Date';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  }
}
