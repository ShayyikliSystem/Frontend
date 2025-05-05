import { AdminService } from './../../../services/admin.service';
import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  DigitalCheckExtended,
  DigitalCheck,
} from '../../../models/digital.model';
import { CheckRefreshService } from '../../../services/check-refresh.service';
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
import { OutcomingEndorsementsChecksFilterComponent } from '../../../palestinian-user-screens/endorsement/outcoming-endorsements-checks-filter/outcoming-endorsements-checks-filter.component';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-outcoming-checks-per-user',
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
    OutcomingEndorsementsChecksFilterComponent,
    MatTooltipModule,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './outcoming-checks-per-user.component.html',
  styleUrl: './outcoming-checks-per-user.component.scss',
})
export class OutcomingChecksPerUserComponent
  implements OnChanges, AfterViewInit
{
  @Input() accountNumber!: number;

  outcomingEndorsementsCheckFilterStatus: string = '';
  outcomingEndorsementsCheckFilterAmount: number | null = null;
  outcomingEndorsementsCheckFilterIssuer: string = '';
  outcomingEndorsementsCheckFilterBeneficiary: string = '';
  userFullName: string = 'N/A';

  showFilter: boolean = false;

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

    this.fetchOutcomingEndorsementsChecks();

    this.checkRefreshService.refresh$.subscribe(() => {
      this.fetchOutcomingEndorsementsChecks();
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

    this.fetchOutcomingEndorsementsChecks();

    this.outcomingEndorsementsCheckDataSource.filterPredicate = (
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

    this.outcomingEndorsementsCheckDataSource.filterPredicate = (
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
    this.outcomingEndorsementsCheckFilterDate = null;
    this.outcomingEndorsementsCheckFilterAmount = null;
    this.outcomingEndorsementsCheckFilterStatus = '';
    this.outcomingEndorsementsCheckFilterIssuer = '';
    this.outcomingEndorsementsCheckFilterBeneficiary = '';
    this.applyOutcomingEndorsementsCheckFilter();
  }

  onFilterApply(filter: any): void {
    this.outcomingEndorsementsCheckFilterDate = filter.date;
    this.outcomingEndorsementsCheckFilterAmount = filter.amount;
    this.outcomingEndorsementsCheckFilterStatus = filter.status;
    this.outcomingEndorsementsCheckFilterIssuer =
      typeof filter.issuer === 'object' && filter.issuer
        ? `${filter.issuer.firstName} ${filter.issuer.lastName}`
        : filter.issuer;
    this.outcomingEndorsementsCheckFilterBeneficiary = filter.beneficiary;
    this.applyOutcomingEndorsementsCheckFilter();
    this.closeFilter();
  }

  statusOptions: string[] = ['Active', 'Transfer', 'Return', 'Settle'];

  allUsers: any[] = [];
  filteredIssuers: any[] = [];
  filteredBeneficiaries: any[] = [];

  outcomingEndorsementsCheckDisplayedColumns: string[] = [
    'checkId',
    'issuerName',
    'beneficiaryName',
    'endorsersNames',
    'amount',
    'status',
    'transferDate',
  ];
  outcomingEndorsementsCheckDataSource =
    new MatTableDataSource<DigitalCheckExtended>();

  shayyikliAccountNumber: string | null = null;

  outcomingEndorsementsCheckFilterDate: Date | null = null;
  dynamicPageSizeOptions: number[] = [5, 10, 15, 20, 25];

  @ViewChild(MatSort) set sort(ms: MatSort) {
    this.outcomingEndorsementsCheckDataSource.sort = ms;
    if (this.outcomingEndorsementsCheckDataSource.paginator) {
      this.outcomingEndorsementsCheckDataSource.paginator.firstPage();
    }
  }

  private _paginator!: MatPaginator;

  @ViewChild(MatPaginator) set paginator(mp: MatPaginator) {
    this._paginator = mp;
    this.outcomingEndorsementsCheckDataSource.paginator = mp;
  }

  ngAfterViewInit(): void {
    this.outcomingEndorsementsCheckDataSource.sort = this.sort;
    this.outcomingEndorsementsCheckDataSource.paginator = this.paginator;
  }

  fetchOutcomingEndorsementsChecks(): void {
    this.loadingService.loadingOn();
    this.adminService.getOutgoingEndorsedChecks(this.accountNumber).subscribe({
      next: (data: DigitalCheck[]) => {
        const outcomingEndorsementsChecks: DigitalCheckExtended[] = data.map(
          (tx: DigitalCheck) => ({
            ...tx,
            transferDate: this.formatDate(tx.transferDate),
            rawTransferDate: tx.transferDate,
          })
        );

        outcomingEndorsementsChecks.forEach((tx) => {
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
          if (tx.shyyiklinumberOfEndorsers !== null) {
            this.userService
              .getUserDetailsByAccountNumber(tx.shyyiklinumberOfEndorsers)
              .subscribe({
                next: (userData) => {
                  tx.endorsersNames = `${userData.firstName} ${userData.lastName}`;
                  setTimeout(() => {
                    this.loadingService.loadingOff();
                  }, 400);
                },
                error: (err) => {
                  console.error('Error fetching issuer details', err);
                  tx.endorsersNames = 'N/A';
                  setTimeout(() => {
                    this.loadingService.loadingOff();
                  }, 400);
                },
              });
          } else {
            tx.endorsersNames = 'N/A';
            setTimeout(() => {
              this.loadingService.loadingOff();
            }, 400);
          }

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
        });

        outcomingEndorsementsChecks.sort(
          (a, b) =>
            new Date(b.rawTransferDate).getTime() -
            new Date(a.rawTransferDate).getTime()
        );
        this.outcomingEndorsementsCheckDataSource.data =
          outcomingEndorsementsChecks;
        this.updatePageSizeOptions();
        this.resetPaginator();
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
      error: (error) => {
        console.error(
          'Error fetching recent outcomingEndorsementsChecks:',
          error
        );
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
    });
  }

  applyOutcomingEndorsementsCheckFilter(): void {
    const filterValue = {
      date: this.outcomingEndorsementsCheckFilterDate
        ? this.outcomingEndorsementsCheckFilterDate.toISOString()
        : '',
      status: this.outcomingEndorsementsCheckFilterStatus
        ? this.outcomingEndorsementsCheckFilterStatus
        : '',
      amount: this.outcomingEndorsementsCheckFilterAmount
        ? this.outcomingEndorsementsCheckFilterAmount
        : '',
      issuer: this.outcomingEndorsementsCheckFilterIssuer
        ? this.outcomingEndorsementsCheckFilterIssuer
        : '',
      beneficiary: this.outcomingEndorsementsCheckFilterBeneficiary
        ? this.outcomingEndorsementsCheckFilterBeneficiary
        : '',
    };
    this.outcomingEndorsementsCheckDataSource.filter =
      JSON.stringify(filterValue);
    this.updatePageSizeOptions();
    this.resetPaginator();
  }

  updatePageSizeOptions(): void {
    const totalItems = this.outcomingEndorsementsCheckDataSource.paginator
      ? this.outcomingEndorsementsCheckDataSource.paginator.length
      : this.outcomingEndorsementsCheckDataSource.filteredData.length;

    const pageSize = this.outcomingEndorsementsCheckDataSource.paginator
      ? this.outcomingEndorsementsCheckDataSource.paginator.pageSize
      : 5;

    if (totalItems <= pageSize) {
      this.dynamicPageSizeOptions = [totalItems];
      return;
    }

    const options: number[] = [];
    for (let size = pageSize; size <= totalItems; size += pageSize) {
      options.push(size);
    }
    if (options[options.length - 1] < totalItems) {
      options.push(totalItems);
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
      this.outcomingEndorsementsCheckFilterDate ||
      this.outcomingEndorsementsCheckFilterAmount ||
      this.outcomingEndorsementsCheckFilterStatus ||
      this.outcomingEndorsementsCheckFilterIssuer ||
      this.outcomingEndorsementsCheckFilterBeneficiary
    );
  }

  clearFilterProperty(prop: 'status' | 'issuer' | 'beneficiary' | 'date') {
    switch (prop) {
      case 'status':
        this.outcomingEndorsementsCheckFilterStatus = '';
        break;
      case 'issuer':
        this.outcomingEndorsementsCheckFilterIssuer = '';
        break;
      case 'beneficiary':
        this.outcomingEndorsementsCheckFilterBeneficiary = '';
        break;
      case 'date':
        this.outcomingEndorsementsCheckFilterDate = null;
        break;
    }
    this.applyOutcomingEndorsementsCheckFilter();
  }
}
