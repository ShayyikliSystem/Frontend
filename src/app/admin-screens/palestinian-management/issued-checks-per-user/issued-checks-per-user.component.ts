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
import { IssuedCheckFilterComponent } from '../../../palestinian-user-screens/check-management/issued-check-filter/issued-check-filter.component';
import {
  DigitalCheckExtended,
  DigitalCheck,
} from '../../../models/digital.model';
import { CheckRefreshService } from '../../../services/check-refresh.service';
import { LoadingService } from '../../../services/loading.service';
import { UserService } from '../../../services/user.service';
import { ConfirmDeleteComponent } from './confirm-delete/confirm-delete.component';
import { AlertComponent } from '../../../alert/alert.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-issued-checks-per-user',
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
    IssuedCheckFilterComponent,
    MatTooltipModule,
    ConfirmDeleteComponent,
    AlertComponent,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './issued-checks-per-user.component.html',
  styleUrl: './issued-checks-per-user.component.scss',
})
export class IssuedChecksPerUserComponent implements AfterViewInit, OnChanges {
  @Input() accountNumber!: number;

  selectedCheckId: number | null = null;
  showDeleteOverlay = false;

  issuedCheckFilterStatus: string = '';
  issuedCheckFilterAmount: number | null = null;
  issuedCheckFilterIssuer: string = '';
  issuedCheckFilterBeneficiary: string = '';
  userFullName: string = 'N/A';

  showFilter: boolean = false;

  alert = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'error',
  };

  constructor(
    private userService: UserService,
    private adminService: AdminService,
    private loadingService: LoadingService,
    private checkRefreshService: CheckRefreshService
  ) {}

  ngOnChanges(): void {
    this.shayyikliAccountNumber = localStorage.getItem(
      'shayyikliAccountNumber'
    );

    this.checkRefreshService.refresh$.subscribe(() => {
      this.fetchIssuedChecks();
      this.updatePageSizeOptions();
      this.resetPaginator();
    });

    if (this.shayyikliAccountNumber) {
      const accountNumber = Number(this.shayyikliAccountNumber);
      this.loadingService.loadingOn();
      this.userService.getUserDetailsByAccountNumber(accountNumber).subscribe({
        next: (userData) => {
          this.userFullName = userData.firstName;
          setTimeout(() => {
            this.loadingService.loadingOff();
          }, 400);
        },
        error: (error) => {
          console.error('Error fetching user details', error);
          setTimeout(() => {
            this.loadingService.loadingOff();
          }, 400);
        },
      });
    }

    this.fetchIssuedChecks();

    this.issuedCheckDataSource.filterPredicate = (
      data: DigitalCheckExtended,
      filter: string
    ): boolean => {
      const searchTerms = JSON.parse(filter);
      let dateMatch = true;
      if (searchTerms.date && data.rawTransferDate) {
        const filterDate = new Date(searchTerms.date);
        const dataDate = new Date(data.rawTransferDate);
        dateMatch =
          filterDate.getDate() === dataDate.getDate() &&
          filterDate.getMonth() === dataDate.getMonth() &&
          filterDate.getFullYear() === dataDate.getFullYear();
      }
      return dateMatch;
    };

    this.issuedCheckDataSource.filterPredicate = (
      data: DigitalCheckExtended,
      filter: string
    ): boolean => {
      const searchTerms = JSON.parse(filter);
      let dateMatch = true,
        statusMatch = true,
        amountMatch = true,
        issuerMatch = true,
        beneficiaryMatch = true;

      if (searchTerms.date && data.rawTransferDate) {
        const filterDate = new Date(searchTerms.date);
        const dataDate = new Date(data.rawTransferDate);
        dateMatch =
          filterDate.getDate() === dataDate.getDate() &&
          filterDate.getMonth() === dataDate.getMonth() &&
          filterDate.getFullYear() === dataDate.getFullYear();
      }

      if (searchTerms.status) {
        statusMatch = data.status === searchTerms.status;
      }

      if (searchTerms.amount) {
        amountMatch = data.amount === searchTerms.amount;
      }

      if (searchTerms.issuer && data.issuerName) {
        issuerMatch = data.issuerName
          .toLowerCase()
          .includes(searchTerms.issuer.toLowerCase());
      }

      if (searchTerms.beneficiary && data.beneficiaryName) {
        beneficiaryMatch = data.beneficiaryName
          .toLowerCase()
          .includes(searchTerms.beneficiary.toLowerCase());
      }

      return (
        dateMatch &&
        statusMatch &&
        amountMatch &&
        issuerMatch &&
        beneficiaryMatch
      );
    };
  }

  openFilter(): void {
    this.showFilter = true;
  }

  closeFilter(): void {
    this.showFilter = false;
  }

  clearFilter(): void {
    this.issuedCheckFilterDate = null;
    this.issuedCheckFilterAmount = null;
    this.issuedCheckFilterStatus = '';
    this.issuedCheckFilterIssuer = '';
    this.issuedCheckFilterBeneficiary = '';
    this.applyIssuedCheckFilter();
  }

  onFilterApply(filter: any): void {
    this.issuedCheckFilterDate = filter.date;
    this.issuedCheckFilterAmount = filter.amount;
    this.issuedCheckFilterStatus = filter.status;
    this.issuedCheckFilterIssuer =
      typeof filter.issuer === 'object' && filter.issuer
        ? `${filter.issuer.firstName} ${filter.issuer.lastName}`
        : filter.issuer;
    this.issuedCheckFilterBeneficiary = filter.beneficiary;
    this.applyIssuedCheckFilter();
    this.closeFilter();
  }

  statusOptions: string[] = ['Active', 'Transfer', 'Return', 'Settle'];

  allUsers: any[] = [];
  filteredIssuers: any[] = [];
  filteredBeneficiaries: any[] = [];

  issuedCheckDisplayedColumns: string[] = [
    'checkId',
    'issuerName',
    'beneficiaryName',
    'endorsersNames',
    'amount',
    'status',
    'transferDate',
    'delete',
  ];
  issuedCheckDataSource = new MatTableDataSource<DigitalCheckExtended>();

  shayyikliAccountNumber: string | null = null;

  issuedCheckFilterDate: Date | null = null;
  dynamicPageSizeOptions: number[] = [5, 10, 15, 20, 25];

  @ViewChild(MatSort) set sort(ms: MatSort) {
    this.issuedCheckDataSource.sort = ms;
    if (this.issuedCheckDataSource.paginator) {
      this.issuedCheckDataSource.paginator.firstPage();
    }
  }

  private _paginator!: MatPaginator;

  @ViewChild(MatPaginator) set paginator(mp: MatPaginator) {
    this._paginator = mp;
    this.issuedCheckDataSource.paginator = mp;
  }

  ngAfterViewInit(): void {
    this.issuedCheckDataSource.sort = this.sort;
    this.issuedCheckDataSource.paginator = this.paginator;
  }

  fetchIssuedChecks(): void {
    this.loadingService.loadingOn();
    this.adminService.getIssuedChecksByAccount(this.accountNumber).subscribe({
      next: (data: DigitalCheck[]) => {
        const issuedChecks: DigitalCheckExtended[] = data.map(
          (tx: DigitalCheck) => ({
            ...tx,
            transferDate: this.formatDate(tx.transferDate),
            rawTransferDate: tx.transferDate,
          })
        );

        issuedChecks.forEach((tx) => {
          this.loadingService.loadingOn();
          this.userService
            .getUserDetailsByAccountNumber(tx.shyyiklinumberOfUsers)
            .subscribe({
              next: (userData) => {
                tx.issuerName = `${userData.firstName} ${userData.lastName}`;
                setTimeout(() => {
                  this.loadingService.loadingOff();
                }, 400);
              },
              error: (err) => {
                console.error('Error fetching issuer details', err);
                tx.issuerName = 'N/A';
                setTimeout(() => {
                  this.loadingService.loadingOff();
                }, 400);
              },
            });

          this.loadingService.loadingOn();
          this.userService
            .getUserDetailsByAccountNumber(tx.shyyiklinumberOfBeneficiary)
            .subscribe({
              next: (userData) => {
                tx.beneficiaryName = `${userData.firstName} ${userData.lastName}`;
                setTimeout(() => {
                  this.loadingService.loadingOff();
                }, 400);
              },
              error: (err) => {
                console.error('Error fetching beneficiary details', err);
                tx.beneficiaryName = 'N/A';
                setTimeout(() => {
                  this.loadingService.loadingOff();
                }, 400);
              },
            });

          const endorserNumber = tx.shyyiklinumberOfEndorsers;
          if (endorserNumber != null) {
            this.loadingService.loadingOn();
            this.userService
              .getUserDetailsByAccountNumber(endorserNumber)
              .subscribe({
                next: (userData) => {
                  tx.endorsersNames = `${userData.firstName} ${userData.lastName}`;
                  setTimeout(() => this.loadingService.loadingOff(), 400);
                },
                error: (err) => {
                  console.error('Error fetching endorser details', err);
                  tx.endorsersNames = '-';
                  setTimeout(() => this.loadingService.loadingOff(), 400);
                },
              });
          } else {
            tx.endorsersNames = '-';
          }
        });

        issuedChecks.sort(
          (a, b) =>
            new Date(b.rawTransferDate).getTime() -
            new Date(a.rawTransferDate).getTime()
        );
        this.issuedCheckDataSource.data = issuedChecks;
        this.updatePageSizeOptions();
        this.resetPaginator();
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
      error: (error) => {
        console.error('Error fetching recent issuedChecks:', error);
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
    });
  }

  applyIssuedCheckFilter(): void {
    const filterValue = {
      date: this.issuedCheckFilterDate
        ? this.issuedCheckFilterDate.toISOString()
        : '',
      status: this.issuedCheckFilterStatus ? this.issuedCheckFilterStatus : '',
      amount: this.issuedCheckFilterAmount ? this.issuedCheckFilterAmount : '',
      issuer: this.issuedCheckFilterIssuer ? this.issuedCheckFilterIssuer : '',
      beneficiary: this.issuedCheckFilterBeneficiary
        ? this.issuedCheckFilterBeneficiary
        : '',
    };
    this.issuedCheckDataSource.filter = JSON.stringify(filterValue);
    this.updatePageSizeOptions();
    this.resetPaginator();
  }

  updatePageSizeOptions(): void {
    const count = this.issuedCheckDataSource.filteredData.length;

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

  formatDate(dateString: string): string {
    if (!dateString) return 'Invalid Date';
    const date = new Date(dateString);

    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  }

  hasActiveFilter(): boolean {
    return !!(
      this.issuedCheckFilterDate ||
      this.issuedCheckFilterAmount ||
      this.issuedCheckFilterStatus ||
      this.issuedCheckFilterIssuer ||
      this.issuedCheckFilterBeneficiary
    );
  }

  promptDelete(checkId: number) {
    this.selectedCheckId = checkId;
    this.showDeleteOverlay = true;
  }

  handleCancelDelete() {
    this.showDeleteOverlay = false;
    this.selectedCheckId = null;
  }

  handleConfirmDelete(checkId: number) {
    this.showDeleteOverlay = false;
    this.loadingService.loadingOn();
    this.adminService.clearCheck(checkId.toString()).subscribe({
      next: () => {
        this.fetchIssuedChecks();
        this.showAlert('Check deleted successfully.', 'success');
      },
      error: (err) => {
        console.error('Delete failed', err);
        this.showAlert('Failed to delete check.', 'error');
      },
      complete: () => this.loadingService.loadingOff(),
    });
  }

  private showAlert(message: string, type: 'success' | 'error') {
    this.alert = { show: true, message, type };
  }

  clearFilterProperty(prop: 'status' | 'beneficiary' | 'date' | 'amount') {
    switch (prop) {
      case 'status':
        this.issuedCheckFilterStatus = '';
        break;
      case 'beneficiary':
        this.issuedCheckFilterBeneficiary = '';
        break;
      case 'date':
        this.issuedCheckFilterDate = null;
        break;
      case 'amount':
        this.issuedCheckFilterAmount = null;
        break;
    }
    this.applyIssuedCheckFilter();
  }
}
