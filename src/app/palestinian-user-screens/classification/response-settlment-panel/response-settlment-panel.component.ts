import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
import { LoadingService } from '../../../services/loading.service';
import { SettlementService } from '../../../services/settlement.service';
import { RequestedSettlementFilterComponent } from '../requested-settlement-filter/requested-settlement-filter.component';
import { AlertComponent } from '../../../alert/alert.component';
import { SettlementRefreshService } from '../../../services/settlement-refresh.service';

@Component({
  selector: 'app-response-settlment-panel',
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
    RequestedSettlementFilterComponent,
    AlertComponent,
  ],
  templateUrl: './response-settlment-panel.component.html',
  styleUrl: './response-settlment-panel.component.scss',
})
export class ResponseSettlmentPanelComponent implements OnInit, AfterViewInit {
  displayedColumns = [
    'checkId',
    'initiatorName',
    'transferDate',
    'amount',
    'status',
    'actions',
  ];

  showFilter = false;
  defaultFilter = { status: '', initiator: '', date: null };
  currentFilter = { ...this.defaultFilter };

  beneficiaryRequestsDataSource = new MatTableDataSource<any>();
  dynamicPageSizeOptions: number[] = [5, 10, 15];
  classification: any = 'N/A';
  hasActiveCheckbook: boolean = false;
  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';

  @ViewChild(MatSort) set sort(ms: MatSort) {
    this.beneficiaryRequestsDataSource.sort = ms;
    if (this.beneficiaryRequestsDataSource.paginator) {
      this.beneficiaryRequestsDataSource.paginator.firstPage();
    }
  }

  @ViewChild(MatPaginator) set paginator(mp: MatPaginator) {
    this.beneficiaryRequestsDataSource.paginator = mp;
  }

  constructor(
    private settlementService: SettlementService,
    private loadingService: LoadingService,
    private settlementRefreshService: SettlementRefreshService
  ) {}

  handleAlert(event: { message: string; type: 'success' | 'error' }): void {
    this.alertMessage = event.message;
    this.alertType = event.type;
    setTimeout(() => (this.alertMessage = ''), 5000);
  }
  ngOnInit(): void {
    this.loadRequests();

    this.settlementRefreshService.refresh$.subscribe(() => {
      this.loadRequests();
    });
  }

  ngAfterViewInit(): void {
    this.beneficiaryRequestsDataSource.sort = this.sort;
    this.beneficiaryRequestsDataSource.paginator = this.paginator;
  }

  resetPaginator(): void {
    if (this.paginator) {
      this.paginator.firstPage();
      this.paginator.pageSize = this.dynamicPageSizeOptions[0];
    }
  }

  private loadRequests(): void {
    this.loadingService.loadingOn();
    this.settlementService.getSettlementsForBeneficiary().subscribe({
      next: (data: any[]) => {
        data.sort((a, b) => {
          const aPending = a.status?.toLowerCase() === 'pending';
          const bPending = b.status?.toLowerCase() === 'pending';
          if (aPending && !bPending) return -1;
          if (!aPending && bPending) return 1;
          return 0;
        });

        this.beneficiaryRequestsDataSource.data = data;

        this.updatePageSizeOptions();
        this.resetPaginator();
        if (this.paginator) {
          this.paginator.firstPage();
        }
      },
      error: (err) => console.error('Error loading requests', err),
      complete: () => this.loadingService.loadingOff(),
    });
  }

  respond(checkId: string, accepted: boolean): void {
    this.loadingService.loadingOn();
    this.settlementService
      .respondToSettlement({ checkId, accepted })
      .subscribe({
        next: () => {
          this.loadRequests();

          this.handleAlert({
            message: accepted
              ? 'Settlement request accepted successfully!'
              : 'Settlement request rejected successfully!',
            type: 'success',
          });
          setTimeout(() => this.loadingService.loadingOff(), 400);
        },

        error: (err) => {
          console.error('Failed to send response', err);

          this.handleAlert({
            message: 'Failed to respond to settlement. Please try again.',
            type: 'error',
          });

          setTimeout(() => this.loadingService.loadingOff(), 400);
        },
      });
  }

  updatePageSizeOptions(): void {
    const count = this.beneficiaryRequestsDataSource.filteredData.length;
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

  applyFilter(): void {
    this.beneficiaryRequestsDataSource.filterPredicate = (
      data: any,
      filter: string
    ) => {
      const f = JSON.parse(filter);
      const dateMatch = f.date
        ? new Date(data.transferDate).toDateString() ===
          new Date(f.date).toDateString()
        : true;
      const statusMatch = f.status
        ? data.status?.toLowerCase() === f.status.toLowerCase()
        : true;
      const initiatorMatch = f.initiator
        ? data.initiatorName?.toLowerCase().includes(f.initiator.toLowerCase())
        : true;

      return dateMatch && statusMatch && initiatorMatch;
    };

    this.beneficiaryRequestsDataSource.filter = JSON.stringify(
      this.currentFilter
    );
    this.updatePageSizeOptions();
    if (this.paginator) this.paginator.firstPage();
    this.resetPaginator();
  }

  onFilterApply(filter: any): void {
    this.currentFilter = filter;
    this.applyFilter();
    this.showFilter = false;
  }

  clearFilter(): void {
    this.currentFilter = { ...this.defaultFilter };
    this.applyFilter();
  }

  hasActiveFilter(): boolean {
    return !!(
      this.currentFilter.status ||
      this.currentFilter.initiator ||
      this.currentFilter.date
    );
  }

  openFilter(): void {
    this.currentFilter = { ...this.defaultFilter };
    this.showFilter = true;
  }
}
