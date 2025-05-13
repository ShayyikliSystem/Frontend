import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { LoadingService } from '../../../services/loading.service';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SettlementService } from '../../../services/settlement.service';
import { CreateSettlementFormComponent } from '../create-settlement-form/create-settlement-form.component';
import { CurrentSettlementFilterComponent } from '../current-settlement-filter/current-settlement-filter.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AlertComponent } from '../../../alert/alert.component';
import { SettlementRefreshService } from '../../../services/settlement-refresh.service';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-create-settlement-panel',
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
    CreateSettlementFormComponent,
    CurrentSettlementFilterComponent,
    MatTooltipModule,
    AlertComponent,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './create-settlement-panel.component.html',
  styleUrl: './create-settlement-panel.component.scss',
})
export class CreateSettlementPanelComponent implements OnInit, AfterViewInit {
  classification: any = 'N/A';

  isSettlementActive = false;
  showSettlementForm = false;
  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';
  dynamicPageSizeOptions: number[] = [5, 10, 15, 20, 25];

  displayedColumns = [
    'checkId',
    'targetUserName',
    'transferDate',
    'amount',
    'status',
    'resettle',
  ];

  initiatorDetailsDataSource = new MatTableDataSource<any>();

  showFilter = false;

  defaultFilter = {
    status: '',
    beneficiary: '',
    date: null,
  };

  currentFilter = { ...this.defaultFilter };

  @ViewChild(MatSort) set sort(ms: MatSort) {
    this.initiatorDetailsDataSource.sort = ms;
    if (this.initiatorDetailsDataSource.paginator) {
      this.initiatorDetailsDataSource.paginator.firstPage();
    }
  }

  private _paginator!: MatPaginator;

  @ViewChild(MatPaginator) set paginator(mp: MatPaginator) {
    this._paginator = mp;
    this.initiatorDetailsDataSource.paginator = mp;
  }

  handleAlert(event: { message: string; type: 'success' | 'error' }): void {
    this.alertMessage = event.message;
    this.alertType = event.type;
    setTimeout(() => (this.alertMessage = ''), 5000);
  }

  ngAfterViewInit(): void {
    this.initiatorDetailsDataSource.sort = this.sort;
    this.initiatorDetailsDataSource.paginator = this.paginator;
  }

  constructor(
    private settlementService: SettlementService,
    private userService: UserService,
    private loadingService: LoadingService,
    private settlementRefreshService: SettlementRefreshService
  ) {}

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

  ngOnInit(): void {
    this.loadUserData();

    this.settlementRefreshService.refresh$.subscribe(() => {
      this.settlementService.isSettlementActive().subscribe({
        next: (res) => {
          this.isSettlementActive = res;
          if (this.isSettlementActive) {
            this.loadInitiatorDetails();
          }
        },
        error: (err) => {
          console.error('Failed to fetch settlement status', err);
        },
        complete: () => {
          setTimeout(() => {
            this.loadingService.loadingOff();
          }, 400);
        },
      });
      this.loadInitiatorDetails();
      this.updatePageSizeOptions();
      this.resetPaginator();
    });

    this.loadingService.loadingOn();
    this.settlementService.isSettlementActive().subscribe({
      next: (res) => {
        this.isSettlementActive = res;
        if (this.isSettlementActive) {
          this.loadInitiatorDetails();
        }
      },
      error: (err) => {
        console.error('Failed to fetch settlement status', err);
      },
      complete: () => {
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
    });
  }

  updatePageSizeOptions(): void {
    const count = this.initiatorDetailsDataSource.filteredData.length;

    if (count <= 5) {
      this.dynamicPageSizeOptions = [count];
      return;
    }

    const options: number[] = [];
    for (let size = 5; size <= count; size += 5) {
      options.push(size);
    }

    if (options[options.length - 1] !== count) {
      options.push(count);
    }

    this.dynamicPageSizeOptions = options;
  }

  resetPaginator(_useSmallest: boolean = false): void {
    if (!this._paginator) return;
    this._paginator.firstPage();

    const opts = this.dynamicPageSizeOptions;
    if (!opts.length) return;

    this._paginator.pageSize = opts[0];
  }

  openSettlementForm() {
    this.showSettlementForm = true;
  }

  closeSettlementForm() {
    this.showSettlementForm = false;
  }

  onSettlementCompleted() {
    this.showSettlementForm = false;
    this.loadInitiatorDetails();
  }

  private loadInitiatorDetails(): void {
    this.loadingService.loadingOn();
    this.settlementService.getSettlementDetailsForInitiator().subscribe({
      next: (data: any[]) => {
        if (data.length > 0) {
          console.log('First item details:', {
            transferDate: data[0].transferDate,
            typeof: typeof data[0].transferDate,
          });
        }
        data.sort((a, b) => {
          const aRejected = a.status === 'Rejected';
          const bRejected = b.status === 'Rejected';
          if (aRejected && !bRejected) return -1;
          if (!aRejected && bRejected) return 1;
          return 0;
        });

        this.initiatorDetailsDataSource.data = data;

        this.updatePageSizeOptions();
        this.resetPaginator();
      },
      error: (err) => {
        console.error('Error fetching initiator settlement details', err);
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
      complete: () => {
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
    });
  }

  formatDate(dateString: string): string {
    const dt = new Date(dateString);
    if (!dateString) return 'Invalid Date';
    const date = new Date(dateString);

    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(dt);
  }

  resettle(tx: any): void {
    this.loadingService.loadingOn();
    this.settlementService.resettle({ checkId: tx.checkId }).subscribe({
      next: () => {
        this.loadInitiatorDetails();
        this.alertMessage = 'Check resettled successfully.';
        this.alertType = 'success';
      },
      error: (err) => {
        console.error('Error resettling', err);
        this.alertMessage = 'Failed to resettle the check.';
        this.alertType = 'error';
      },
      complete: () => {
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
        setTimeout(() => {
          this.alertMessage = '';
        }, 5000);
      },
    });
  }

  onFilterApply(filter: any): void {
    this.currentFilter = filter;
    this.applyFilter();
    this.showFilter = false;
  }

  clearFilter(): void {
    this.currentFilter = {
      status: '',
      beneficiary: '',
      date: null,
    };
    this.applyFilter();
  }

  hasActiveFilter(): boolean {
    return !!(
      this.currentFilter.status ||
      this.currentFilter.beneficiary ||
      this.currentFilter.date
    );
  }

  applyFilter(): void {
    this.initiatorDetailsDataSource.filterPredicate = (
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
      const beneficiaryMatch = f.beneficiary
        ? data.targetUserName
            .toLowerCase()
            .includes(f.beneficiary.toLowerCase())
        : true;

      return dateMatch && statusMatch && beneficiaryMatch;
    };

    this.initiatorDetailsDataSource.filter = JSON.stringify(this.currentFilter);
    this.updatePageSizeOptions();
    this.resetPaginator();
  }

  openFilter(): void {
    this.currentFilter = { ...this.defaultFilter };
    this.showFilter = true;
  }

  clearFilterProperty(field: 'status' | 'beneficiary' | 'date') {
    switch (field) {
      case 'status':
        this.currentFilter.status = '';
        break;
      case 'beneficiary':
        this.currentFilter.beneficiary = '';
        break;
      case 'date':
        this.currentFilter.date = null;
        break;
    }
    this.applyFilter();
  }
}
