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
import {
  DigitalCheckExtended,
  DigitalCheck,
} from '../../../models/digital.model';
import { CheckRefreshService } from '../../../services/check-refresh.service';
import { DigitalCheckService } from '../../../services/digital-check.service';
import { LoadingService } from '../../../services/loading.service';
import { UserService } from '../../../services/user.service';
import { ReturnedChecksFilterComponent } from '../returned-checks-filter/returned-checks-filter.component';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-returned-checks-panel',
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
    ReturnedChecksFilterComponent,
    MatTooltipModule,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './returned-checks-panel.component.html',
  styleUrl: './returned-checks-panel.component.scss',
})
export class ReturnedChecksPanelComponent implements OnInit, AfterViewInit {
  returnedCheckFilterStatus: string = '';
  returnedCheckFilterAmount: number | null = null;
  returnedCheckFilterIssuer: string = '';
  returnedCheckFilterBeneficiary: string = '';
  userFullName: string = 'N/A';

  showFilter: boolean = false;

  constructor(
    private userService: UserService,
    private digitalCheckService: DigitalCheckService,
    private loadingService: LoadingService,
    private checkRefreshService: CheckRefreshService
  ) {}

  ngOnInit(): void {
    this.shayyikliAccountNumber = localStorage.getItem(
      'shayyikliAccountNumber'
    );

    this.fetchReturnedChecks();

    this.checkRefreshService.refresh$.subscribe(() => {
      this.fetchReturnedChecks();
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

    this.fetchReturnedChecks();

    this.returnedCheckDataSource.filterPredicate = (
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

    this.returnedCheckDataSource.filterPredicate = (
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
    this.returnedCheckFilterDate = null;
    this.returnedCheckFilterAmount = null;
    this.returnedCheckFilterStatus = '';
    this.returnedCheckFilterIssuer = '';
    this.returnedCheckFilterBeneficiary = '';
    this.applyReturnedCheckFilter();
  }

  onFilterApply(filter: any): void {
    this.returnedCheckFilterDate = filter.date;
    this.returnedCheckFilterAmount = filter.amount;
    this.returnedCheckFilterStatus = filter.status;
    this.returnedCheckFilterIssuer =
      typeof filter.issuer === 'object' && filter.issuer
        ? `${filter.issuer.firstName} ${filter.issuer.lastName}`
        : filter.issuer;
    this.returnedCheckFilterBeneficiary = filter.beneficiary;
    this.applyReturnedCheckFilter();
    this.closeFilter();
  }

  statusOptions: string[] = ['Active', 'Transfer', 'Return', 'Settle'];

  allUsers: any[] = [];
  filteredIssuers: any[] = [];
  filteredBeneficiaries: any[] = [];

  returnedCheckDisplayedColumns: string[] = [
    'checkId',
    'issuerName',
    'beneficiaryName',
    'endorsersNames',
    'amount',
    'status',
    'transferDate',
  ];
  returnedCheckDataSource = new MatTableDataSource<DigitalCheckExtended>();

  shayyikliAccountNumber: string | null = null;

  returnedCheckFilterDate: Date | null = null;
  dynamicPageSizeOptions: number[] = [5, 10, 15, 20, 25];

  @ViewChild(MatSort) set sort(ms: MatSort) {
    this.returnedCheckDataSource.sort = ms;
    if (this.returnedCheckDataSource.paginator) {
      this.returnedCheckDataSource.paginator.firstPage();
    }
  }

  private _paginator!: MatPaginator;

  @ViewChild(MatPaginator) set paginator(mp: MatPaginator) {
    this._paginator = mp;
    this.returnedCheckDataSource.paginator = mp;
  }

  ngAfterViewInit(): void {
    this.returnedCheckDataSource.sort = this.sort;
    this.returnedCheckDataSource.paginator = this.paginator;
  }

  fetchReturnedChecks(): void {
    this.loadingService.loadingOn();
    this.digitalCheckService.getReturnedChecksForUser().subscribe({
      next: (data: DigitalCheck[]) => {
        const returnedChecks: DigitalCheckExtended[] = data.map(
          (tx: DigitalCheck) => ({
            ...tx,
            transferDate: this.formatDate(tx.transferDate),
            rawTransferDate: tx.transferDate,
          })
        );

        returnedChecks.forEach((tx) => {
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

        returnedChecks.sort(
          (a, b) =>
            new Date(b.rawTransferDate).getTime() -
            new Date(a.rawTransferDate).getTime()
        );
        this.returnedCheckDataSource.data = returnedChecks;
        this.updatePageSizeOptions();
        this.resetPaginator();
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
      error: (error) => {
        console.error('Error fetching recent returnedChecks:', error);
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
    });
  }

  applyReturnedCheckFilter(): void {
    const filterValue = {
      date: this.returnedCheckFilterDate
        ? this.returnedCheckFilterDate.toISOString()
        : '',
      status: this.returnedCheckFilterStatus
        ? this.returnedCheckFilterStatus
        : '',
      amount: this.returnedCheckFilterAmount
        ? this.returnedCheckFilterAmount
        : '',
      issuer: this.returnedCheckFilterIssuer
        ? this.returnedCheckFilterIssuer
        : '',
      beneficiary: this.returnedCheckFilterBeneficiary
        ? this.returnedCheckFilterBeneficiary
        : '',
    };
    this.returnedCheckDataSource.filter = JSON.stringify(filterValue);
    this.updatePageSizeOptions();
    this.resetPaginator();
  }

  updatePageSizeOptions(): void {
    const totalItems = this.returnedCheckDataSource.paginator
      ? this.returnedCheckDataSource.paginator.length
      : this.returnedCheckDataSource.filteredData.length;

    const pageSize = this.returnedCheckDataSource.paginator
      ? this.returnedCheckDataSource.paginator.pageSize
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
      this.returnedCheckFilterDate ||
      this.returnedCheckFilterAmount ||
      this.returnedCheckFilterStatus ||
      this.returnedCheckFilterIssuer ||
      this.returnedCheckFilterBeneficiary
    );
  }

  clearFilterProperty(prop: 'beneficiary' | 'date') {
    switch (prop) {
      case 'beneficiary':
        this.returnedCheckFilterBeneficiary = '';
        break;
      case 'date':
        this.returnedCheckFilterDate = null;
        break;
    }
    this.applyReturnedCheckFilter();
  }
}
