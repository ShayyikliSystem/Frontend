import { AdminService } from './../../../services/admin.service';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SettlementDetailsComponent } from '../../../palestinian-user-screens/classification/settlement-details/settlement-details.component';
import { LoadingService } from '../../../services/loading.service';
import { SettlementRefreshService } from '../../../services/settlement-refresh.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-settlement-history-per-user',
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
    SettlementDetailsComponent,
  ],
  templateUrl: './settlement-history-per-user.component.html',
  styleUrl: './settlement-history-per-user.component.scss',
})
export class SettlementHistoryPerUserComponent
  implements OnChanges, AfterViewInit
{
  @Input() accountNumber!: number;

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

  showDetailsOverlay = false;
  selectedSettlementId!: number;

  constructor(
    private adminService: AdminService,
    private loadingService: LoadingService,
    private userService: UserService,
    private settlementRefreshService: SettlementRefreshService
  ) {}

  ngOnChanges(): void {
    this.fetchSettlementHistory();

    this.settlementRefreshService.refresh$.subscribe(() => {
      this.fetchSettlementHistory();
      this.updatePageSizeOptions();
    });
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
    this.adminService.getSettlementHistory(this.accountNumber).subscribe({
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
    }).format(date);
  }

  openDetails(id: number): void {
    this.selectedSettlementId = id;
    this.showDetailsOverlay = true;
  }

  closeDetails(): void {
    this.showDetailsOverlay = false;
  }
}
