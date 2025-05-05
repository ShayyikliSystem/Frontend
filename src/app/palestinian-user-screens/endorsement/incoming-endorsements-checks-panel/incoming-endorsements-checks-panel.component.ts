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
import { IncomingEndorsementsChecksFilterComponent } from '../incoming-endorsements-checks-filter/incoming-endorsements-checks-filter.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

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
    IncomingEndorsementsChecksFilterComponent,
    MatTooltipModule,
    MatChipsModule,
    MatIconModule,
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
  incomingEndorsementsCheckFilterEndorser = '';
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
      const s = JSON.parse(filter);
      let dateMatch = true,
        statusMatch = true,
        amountMatch = true,
        issuerMatch = true,
        endorserMatch = true;

      if (s.date && data.rawTransferDate) {
        const fd = new Date(s.date),
          dd = new Date(data.rawTransferDate);
        dateMatch =
          fd.getFullYear() === dd.getFullYear() &&
          fd.getMonth() === dd.getMonth() &&
          fd.getDate() === dd.getDate();
      }

      if (s.status) {
        statusMatch = data.status === s.status;
      }

      if (s.amount) {
        amountMatch = data.amount === s.amount;
      }

      if (s.issuer) {
        issuerMatch =
          data.issuerName?.toLowerCase().includes(s.issuer.toLowerCase()) ??
          false;
      }

      if (s.endorser) {
        endorserMatch =
          data.endorsersNames
            ?.toLowerCase()
            .includes(s.endorser.toLowerCase()) ?? false;
      }

      return (
        dateMatch && statusMatch && amountMatch && issuerMatch && endorserMatch
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
    this.incomingEndorsementsCheckFilterEndorser = '';
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
    this.incomingEndorsementsCheckFilterEndorser =
      typeof filter.endorser === 'object'
        ? `${filter.endorser.firstName} ${filter.endorser.lastName}`
        : filter.endorser;
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

  private _paginator!: MatPaginator;

  @ViewChild(MatPaginator) set paginator(mp: MatPaginator) {
    this._paginator = mp;
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
      date: this.incomingEndorsementsCheckFilterDate?.toISOString() || '',
      status: this.incomingEndorsementsCheckFilterStatus || '',
      issuer: this.incomingEndorsementsCheckFilterIssuer || '',
      endorser: this.incomingEndorsementsCheckFilterEndorser || '',
      amount: this.incomingEndorsementsCheckFilterAmount || '',
    };
    this.incomingEndorsementsCheckDataSource.filter =
      JSON.stringify(filterValue);
    this.resetPaginator();
    this.updatePageSizeOptions();
  }

  updatePageSizeOptions(): void {
    const totalItems = this.incomingEndorsementsCheckDataSource.paginator
      ? this.incomingEndorsementsCheckDataSource.paginator.length
      : this.incomingEndorsementsCheckDataSource.filteredData.length;

    const pageSize = this.incomingEndorsementsCheckDataSource.paginator
      ? this.incomingEndorsementsCheckDataSource.paginator.pageSize
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
      this.incomingEndorsementsCheckFilterDate ||
      this.incomingEndorsementsCheckFilterAmount ||
      this.incomingEndorsementsCheckFilterStatus ||
      this.incomingEndorsementsCheckFilterIssuer ||
      this.incomingEndorsementsCheckFilterBeneficiary ||
      this.incomingEndorsementsCheckFilterEndorser
    );
  }

  clearFilterProperty(prop: 'status' | 'issuer' | 'endorser' | 'date') {
    switch (prop) {
      case 'status':
        this.incomingEndorsementsCheckFilterStatus = '';
        break;
      case 'issuer':
        this.incomingEndorsementsCheckFilterIssuer = '';
        break;
      case 'endorser':
        this.incomingEndorsementsCheckFilterEndorser = '';
        break;
      case 'date':
        this.incomingEndorsementsCheckFilterDate = null;
        break;
    }
    this.applyIncomingEndorsementsCheckFilter();
  }
}
