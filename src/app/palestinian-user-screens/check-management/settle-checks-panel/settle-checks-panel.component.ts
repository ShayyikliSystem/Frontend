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
import { SettleChecksFilterComponent } from '../settle-checks-filter/settle-checks-filter.component';
import {
  DigitalCheckExtended,
  DigitalCheck,
} from '../../../models/digital.model';
import { CheckRefreshService } from '../../../services/check-refresh.service';
import { DigitalCheckService } from '../../../services/digital-check.service';
import { LoadingService } from '../../../services/loading.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-settle-checks-panel',
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
    SettleChecksFilterComponent,
    MatTooltipModule,
  ],
  templateUrl: './settle-checks-panel.component.html',
  styleUrl: './settle-checks-panel.component.scss',
})
export class SettleChecksPanelComponent implements OnInit, AfterViewInit {
  settleCheckFilterStatus: string = '';
  settleCheckFilterAmount: number | null = null;
  settleCheckFilterIssuer: string = '';
  settleCheckFilterBeneficiary: string = '';
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

    this.fetchSettleChecks();

    this.checkRefreshService.refresh$.subscribe(() => {
      this.fetchSettleChecks();
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

    this.settleCheckDataSource.filterPredicate = (
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

    this.settleCheckDataSource.filterPredicate = (
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
    this.settleCheckFilterDate = null;
    this.settleCheckFilterAmount = null;
    this.settleCheckFilterStatus = '';
    this.settleCheckFilterIssuer = '';
    this.settleCheckFilterBeneficiary = '';
    this.applySettleCheckFilter();
  }

  onFilterApply(filter: any): void {
    this.settleCheckFilterDate = filter.date;
    this.settleCheckFilterAmount = filter.amount;
    this.settleCheckFilterStatus = filter.status;
    this.settleCheckFilterIssuer =
      typeof filter.issuer === 'object' && filter.issuer
        ? `${filter.issuer.firstName} ${filter.issuer.lastName}`
        : filter.issuer;
    this.settleCheckFilterBeneficiary = filter.beneficiary;
    this.applySettleCheckFilter();
    this.closeFilter();
  }

  statusOptions: string[] = ['Active', 'Transfer', 'Return'];

  allUsers: any[] = [];
  filteredIssuers: any[] = [];
  filteredBeneficiaries: any[] = [];

  settleCheckDisplayedColumns: string[] = [
    'checkId',
    'issuerName',
    'beneficiaryName',
    'endorsersNames',
    'amount',
    'status',
    'transferDate',
  ];
  settleCheckDataSource = new MatTableDataSource<DigitalCheckExtended>();

  shayyikliAccountNumber: string | null = null;

  settleCheckFilterDate: Date | null = null;
  dynamicPageSizeOptions: number[] = [5, 10, 15, 20, 25];

  @ViewChild(MatSort) set sort(ms: MatSort) {
    this.settleCheckDataSource.sort = ms;
    if (this.settleCheckDataSource.paginator) {
      this.settleCheckDataSource.paginator.firstPage();
    }
  }

  @ViewChild(MatPaginator) set paginator(mp: MatPaginator) {
    this.settleCheckDataSource.paginator = mp;
  }

  ngAfterViewInit(): void {
    this.settleCheckDataSource.sort = this.sort;
    this.settleCheckDataSource.paginator = this.paginator;
  }

  fetchSettleChecks(): void {
    this.loadingService.loadingOn();
    this.digitalCheckService.getSetteledChecksForUser().subscribe({
      next: (data: DigitalCheck[]) => {
        const settleChecks: DigitalCheckExtended[] = data.map(
          (tx: DigitalCheck) => ({
            ...tx,
            transferDate: this.formatDate(tx.transferDate),
            rawTransferDate: tx.transferDate,
          })
        );

        settleChecks.forEach((tx) => {
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

        settleChecks.sort(
          (a, b) =>
            new Date(b.rawTransferDate).getTime() -
            new Date(a.rawTransferDate).getTime()
        );
        this.settleCheckDataSource.data = settleChecks;
        this.updatePageSizeOptions();
        this.resetPaginator();
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
      error: (error) => {
        console.error('Error fetching recent settleChecks:', error);
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
    });
  }

  applySettleCheckFilter(): void {
    const filterValue = {
      date: this.settleCheckFilterDate
        ? this.settleCheckFilterDate.toISOString()
        : '',
      status: this.settleCheckFilterStatus ? this.settleCheckFilterStatus : '',
      amount: this.settleCheckFilterAmount ? this.settleCheckFilterAmount : '',
      issuer: this.settleCheckFilterIssuer ? this.settleCheckFilterIssuer : '',
      beneficiary: this.settleCheckFilterBeneficiary
        ? this.settleCheckFilterBeneficiary
        : '',
    };
    this.settleCheckDataSource.filter = JSON.stringify(filterValue);
    this.updatePageSizeOptions();
    this.resetPaginator();
  }

  updatePageSizeOptions(): void {
    const count = this.settleCheckDataSource.filteredData.length;

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
    }).format(date);
  }

  hasActiveFilter(): boolean {
    return !!(
      this.settleCheckFilterDate ||
      this.settleCheckFilterAmount ||
      this.settleCheckFilterStatus ||
      this.settleCheckFilterIssuer ||
      this.settleCheckFilterBeneficiary
    );
  }
}
