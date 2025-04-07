import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  DigitalCheckExtended,
  DigitalCheck,
} from '../../../models/digital.model';
import { CheckRefreshService } from '../../../services/check-refresh.service';
import { DigitalCheckService } from '../../../services/digital-check.service';
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
import { IssuedCheckFilterComponent } from '../../check-management/issued-check-filter/issued-check-filter.component';

@Component({
  selector: 'app-incoming-endorsements-checks-panel',
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
  ],
  templateUrl: './incoming-endorsements-checks-panel.component.html',
  styleUrl: './incoming-endorsements-checks-panel.component.scss',
})
export class IncomingEndorsementsChecksPanelComponent
  implements OnInit, AfterViewInit
{
  incomingEndorsementsCheckFilterStatus: string = '';
  incomingEndorsementsCheckFilterAmount: number | null = null;
  incomingEndorsementsCheckFilterIssuer: string = '';
  incomingEndorsementsCheckFilterBeneficiary: string = '';
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

    this.fetchIncomingEndorsementsChecks();

    this.checkRefreshService.refresh$.subscribe(() => {
      this.fetchIncomingEndorsementsChecks();
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

    this.fetchIncomingEndorsementsChecks();

    this.incomingEndorsementsCheckDataSource.filterPredicate = (
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

    this.incomingEndorsementsCheckDataSource.filterPredicate = (
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
    this.incomingEndorsementsCheckFilterDate = null;
    this.incomingEndorsementsCheckFilterAmount = null;
    this.incomingEndorsementsCheckFilterStatus = '';
    this.incomingEndorsementsCheckFilterIssuer = '';
    this.incomingEndorsementsCheckFilterBeneficiary = '';
    this.applyIncomingEndorsementsCheckFilter();
  }

  onFilterApply(filter: any): void {
    this.incomingEndorsementsCheckFilterDate = filter.date;
    this.incomingEndorsementsCheckFilterAmount = filter.amount;
    this.incomingEndorsementsCheckFilterStatus = filter.status;
    this.incomingEndorsementsCheckFilterIssuer =
      typeof filter.issuer === 'object' && filter.issuer
        ? `${filter.issuer.firstName} ${filter.issuer.lastName}`
        : filter.issuer;
    this.incomingEndorsementsCheckFilterBeneficiary = filter.beneficiary;
    this.applyIncomingEndorsementsCheckFilter();
    this.closeFilter();
  }

  statusOptions: string[] = ['Active', 'Transfer', 'Return', 'Settle'];

  allUsers: any[] = [];
  filteredIssuers: any[] = [];
  filteredBeneficiaries: any[] = [];

  incomingEndorsementsCheckDisplayedColumns: string[] = [
    'checkId',
    'issuerName',
    'beneficiaryName',
    'endorsersNames',
    'amount',
    'status',
    'transferDate',
  ];
  incomingEndorsementsCheckDataSource =
    new MatTableDataSource<DigitalCheckExtended>();

  shayyikliAccountNumber: string | null = null;

  incomingEndorsementsCheckFilterDate: Date | null = null;
  dynamicPageSizeOptions: number[] = [5, 10, 15, 20, 25];

  @ViewChild(MatSort) set sort(ms: MatSort) {
    this.incomingEndorsementsCheckDataSource.sort = ms;
    if (this.incomingEndorsementsCheckDataSource.paginator) {
      this.incomingEndorsementsCheckDataSource.paginator.firstPage();
    }
  }

  @ViewChild(MatPaginator) set paginator(mp: MatPaginator) {
    this.incomingEndorsementsCheckDataSource.paginator = mp;
  }

  ngAfterViewInit(): void {
    this.incomingEndorsementsCheckDataSource.sort = this.sort;
    this.incomingEndorsementsCheckDataSource.paginator = this.paginator;
  }

  fetchIncomingEndorsementsChecks(): void {
    this.loadingService.loadingOn();
    this.digitalCheckService.getJiroReceivedChecksForUser().subscribe({
      next: (data: DigitalCheck[]) => {
        const incomingEndorsementsChecks: DigitalCheckExtended[] = data.map(
          (tx: DigitalCheck) => ({
            ...tx,
            transferDate: this.formatDate(tx.transferDate),
            rawTransferDate: tx.transferDate,
          })
        );

        incomingEndorsementsChecks.forEach((tx) => {
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

        incomingEndorsementsChecks.sort(
          (a, b) =>
            new Date(b.rawTransferDate).getTime() -
            new Date(a.rawTransferDate).getTime()
        );
        this.incomingEndorsementsCheckDataSource.data =
          incomingEndorsementsChecks;
        this.updatePageSizeOptions();
        this.resetPaginator();
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
      error: (error) => {
        console.error(
          'Error fetching recent incomingEndorsementsChecks:',
          error
        );
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
    });
  }

  applyIncomingEndorsementsCheckFilter(): void {
    const filterValue = {
      date: this.incomingEndorsementsCheckFilterDate
        ? this.incomingEndorsementsCheckFilterDate.toISOString()
        : '',
      status: this.incomingEndorsementsCheckFilterStatus
        ? this.incomingEndorsementsCheckFilterStatus
        : '',
      amount: this.incomingEndorsementsCheckFilterAmount
        ? this.incomingEndorsementsCheckFilterAmount
        : '',
      issuer: this.incomingEndorsementsCheckFilterIssuer
        ? this.incomingEndorsementsCheckFilterIssuer
        : '',
      beneficiary: this.incomingEndorsementsCheckFilterBeneficiary
        ? this.incomingEndorsementsCheckFilterBeneficiary
        : '',
    };
    this.incomingEndorsementsCheckDataSource.filter =
      JSON.stringify(filterValue);
    this.updatePageSizeOptions();
    this.resetPaginator();
  }

  updatePageSizeOptions(): void {
    const count = this.incomingEndorsementsCheckDataSource.filteredData.length;

    if (count < 5) {
      this.dynamicPageSizeOptions = [count];
      return;
    }

    const options: number[] = [];
    for (let i = 5; i <= count; i += 5) {
      options.push(i);
    }

    if (options[options.length - 1] !== count) {
      options.push(count);
    }
    this.dynamicPageSizeOptions = options;
  }

  resetPaginator(): void {
    if (this.paginator) {
      this.paginator.firstPage();
      this.paginator.pageSize = this.dynamicPageSizeOptions[0];
    }
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

  hasActiveFilter(): boolean {
    return !!(
      this.incomingEndorsementsCheckFilterDate ||
      this.incomingEndorsementsCheckFilterAmount ||
      this.incomingEndorsementsCheckFilterStatus ||
      this.incomingEndorsementsCheckFilterIssuer ||
      this.incomingEndorsementsCheckFilterBeneficiary
    );
  }
}
