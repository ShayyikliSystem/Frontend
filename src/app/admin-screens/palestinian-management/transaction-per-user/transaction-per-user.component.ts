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
import { TransactionFilterComponent } from '../../../palestinian-user-screens/dashboard-screen/transaction-filter/transaction-filter.component';
import {
  DigitalCheckExtended,
  DigitalCheck,
} from '../../../models/digital.model';
import { LoadingService } from '../../../services/loading.service';
import { UserService } from '../../../services/user.service';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-transaction-per-user',
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
    TransactionFilterComponent,
    MatTooltipModule,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './transaction-per-user.component.html',
  styleUrl: './transaction-per-user.component.scss',
})
export class TransactionPerUserComponent implements OnChanges, AfterViewInit {
  @Input() accountNumber!: number;

  transactionFilterStatus: string = '';
  transactionFilterAmount: number | null = null;
  transactionFilterIssuer: string = '';
  transactionFilterBeneficiary: string = '';
  userFullName: string = 'N/A';

  showFilter: boolean = false;

  openFilter(): void {
    this.showFilter = true;
  }

  closeFilter(): void {
    this.showFilter = false;
  }

  clearFilter(): void {
    this.transactionFilterDate = null;
    this.transactionFilterAmount = null;
    this.transactionFilterStatus = '';
    this.transactionFilterIssuer = '';
    this.transactionFilterBeneficiary = '';
    this.applyTransactionFilter();
  }

  onFilterApply(filter: any): void {
    this.transactionFilterDate = filter.date;
    this.transactionFilterAmount = filter.amount;
    this.transactionFilterStatus = filter.status;
    this.transactionFilterIssuer =
      typeof filter.issuer === 'object' && filter.issuer
        ? `${filter.issuer.firstName} ${filter.issuer.lastName}`
        : filter.issuer;
    this.transactionFilterBeneficiary = filter.beneficiary;
    this.applyTransactionFilter();
    this.closeFilter();
  }

  statusOptions: string[] = ['Transfer', 'Return', 'Settle'];

  allUsers: any[] = [];
  filteredIssuers: any[] = [];
  filteredBeneficiaries: any[] = [];

  transactionDisplayedColumns: string[] = [
    'checkId',
    'issuerName',
    'beneficiaryName',
    'endorsersNames',
    'amount',
    'status',
    'transferDate',
  ];
  transactionDataSource = new MatTableDataSource<DigitalCheckExtended>();

  shayyikliAccountNumber: string | null = null;

  transactionFilterDate: Date | null = null;
  dynamicPageSizeOptions: number[] = [5, 10, 15, 20, 25];

  @ViewChild(MatSort) set sort(ms: MatSort) {
    this.transactionDataSource.sort = ms;
    if (this.transactionDataSource.paginator) {
      this.transactionDataSource.paginator.firstPage();
    }
  }

  private _paginator!: MatPaginator;

  @ViewChild(MatPaginator) set paginator(mp: MatPaginator) {
    this._paginator = mp;
    this.transactionDataSource.paginator = mp;
  }

  constructor(
    private userService: UserService,
    private adminService: AdminService,
    private loadingService: LoadingService
  ) {}

  ngOnChanges(): void {
    this.fetchRecentTransactions();

    this.transactionDataSource.filterPredicate = (
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

    this.transactionDataSource.filterPredicate = (
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

  ngAfterViewInit(): void {
    this.transactionDataSource.sort = this.sort;
    this.transactionDataSource.paginator = this.paginator;
  }

  fetchRecentTransactions(): void {
    this.loadingService.loadingOn();
    this.adminService.getTransferChecks(this.accountNumber).subscribe({
      next: (data: DigitalCheck[]) => {
        const transactions: DigitalCheckExtended[] = data.map(
          (tx: DigitalCheck) => ({
            ...tx,
            transferDate: this.formatDate(tx.transferDate),
            rawTransferDate: tx.transferDate,
          })
        );

        transactions.forEach((tx) => {
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

        transactions.sort(
          (a, b) =>
            new Date(b.rawTransferDate).getTime() -
            new Date(a.rawTransferDate).getTime()
        );
        this.transactionDataSource.data = transactions;
        this.updatePageSizeOptions();
        this.resetPaginator();
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
      error: (error) => {
        console.error('Error fetching recent transactions:', error);
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
    });
  }

  applyTransactionFilter(): void {
    const filterValue = {
      date: this.transactionFilterDate
        ? this.transactionFilterDate.toISOString()
        : '',
      status: this.transactionFilterStatus ? this.transactionFilterStatus : '',
      amount: this.transactionFilterAmount ? this.transactionFilterAmount : '',
      issuer: this.transactionFilterIssuer ? this.transactionFilterIssuer : '',
      beneficiary: this.transactionFilterBeneficiary
        ? this.transactionFilterBeneficiary
        : '',
    };
    this.transactionDataSource.filter = JSON.stringify(filterValue);
    this.updatePageSizeOptions();
    this.resetPaginator();
  }

  updatePageSizeOptions(): void {
    const count = this.transactionDataSource.filteredData.length;

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
      this.transactionFilterDate ||
      this.transactionFilterAmount ||
      this.transactionFilterStatus ||
      this.transactionFilterIssuer ||
      this.transactionFilterBeneficiary
    );
  }

  clearFilterProperty(
    prop: 'status' | 'issuer' | 'beneficiary' | 'date' | 'amount'
  ) {
    switch (prop) {
      case 'status':
        this.transactionFilterStatus = '';
        break;
      case 'issuer':
        this.transactionFilterIssuer = '';
        break;
      case 'beneficiary':
        this.transactionFilterBeneficiary = '';
        break;
      case 'date':
        this.transactionFilterDate = null;
        break;
      case 'amount':
        this.transactionFilterAmount = null;
        break;
    }
    this.applyTransactionFilter();
  }
}
