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
import { RequestEndorseCheckFormComponent } from '../request-endorse-check-form/request-endorse-check-form.component';
import { AlertComponent } from '../../../alert/alert.component';
import { ReceivedChecksFilterComponent } from '../../check-management/received-checks-filter/received-checks-filter.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-received-checks-for-endorsements-checks-panel',
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
    RequestEndorseCheckFormComponent,
    AlertComponent,
    ReceivedChecksFilterComponent,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './received-checks-for-endorsements-checks-panel.component.html',
  styleUrl: './received-checks-for-endorsements-checks-panel.component.scss',
})
export class ReceivedChecksForEndorsementsChecksPanelComponent
  implements OnInit, AfterViewInit
{
  receivedCheckFilterStatus: string = '';
  receivedCheckFilterAmount: number | null = null;
  receivedCheckFilterIssuer: string = '';
  receivedCheckFilterBeneficiary: string = '';
  userFullName: string = 'N/A';

  showFilter: boolean = false;

  selectedCheckId: string | null = null;
  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';
  constructor(
    private userService: UserService,
    private digitalCheckService: DigitalCheckService,
    private loadingService: LoadingService,
    private checkRefreshService: CheckRefreshService
  ) {}
  handleAlert(event: { message: string; type: 'success' | 'error' }): void {
    this.alertMessage = event.message;
    this.alertType = event.type;
    setTimeout(() => (this.alertMessage = ''), 5000);
  }
  ngOnInit(): void {
    this.shayyikliAccountNumber = localStorage.getItem(
      'shayyikliAccountNumber'
    );

    this.fetchReceivedChecks();

    this.checkRefreshService.refresh$.subscribe(() => {
      this.fetchReceivedChecks();
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

    this.fetchReceivedChecks();

    this.receivedCheckDataSource.filterPredicate = (
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

    this.receivedCheckDataSource.filterPredicate = (
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
    this.receivedCheckFilterDate = null;
    this.receivedCheckFilterAmount = null;
    this.receivedCheckFilterStatus = '';
    this.receivedCheckFilterIssuer = '';
    this.receivedCheckFilterBeneficiary = '';
    this.applyReceivedCheckFilter();
  }

  onFilterApply(filter: any): void {
    this.receivedCheckFilterDate = filter.date;
    this.receivedCheckFilterAmount = filter.amount;
    this.receivedCheckFilterStatus = filter.status;
    this.receivedCheckFilterIssuer =
      typeof filter.issuer === 'object' && filter.issuer
        ? `${filter.issuer.firstName} ${filter.issuer.lastName}`
        : filter.issuer;
    this.receivedCheckFilterBeneficiary = filter.beneficiary;
    this.applyReceivedCheckFilter();
    this.closeFilter();
  }

  statusOptions: string[] = ['Active', 'Transfer', 'Return', 'Settle'];

  allUsers: any[] = [];
  filteredIssuers: any[] = [];
  filteredBeneficiaries: any[] = [];

  receivedCheckDisplayedColumns: string[] = [
    'checkId',
    'issuerName',
    'beneficiaryName',
    'amount',
    'status',
    'transferDate',
    'endorse',
  ];
  receivedCheckDataSource = new MatTableDataSource<DigitalCheckExtended>();

  shayyikliAccountNumber: string | null = null;

  receivedCheckFilterDate: Date | null = null;
  dynamicPageSizeOptions: number[] = [5, 10, 15, 20, 25];

  @ViewChild(MatSort) set sort(ms: MatSort) {
    this.receivedCheckDataSource.sort = ms;
    if (this.receivedCheckDataSource.paginator) {
      this.receivedCheckDataSource.paginator.firstPage();
    }
  }

  private _paginator!: MatPaginator;

  @ViewChild(MatPaginator) set paginator(mp: MatPaginator) {
    this._paginator = mp;
    this.receivedCheckDataSource.paginator = mp;
  }

  ngAfterViewInit(): void {
    this.receivedCheckDataSource.sort = this.sort;
    this.receivedCheckDataSource.paginator = this.paginator;
  }

  fetchReceivedChecks(): void {
    this.loadingService.loadingOn();
    this.digitalCheckService.getChecksToEndorseForUser().subscribe({
      next: (data: DigitalCheck[]) => {
        const receivedChecks: DigitalCheckExtended[] = data.map(
          (tx: DigitalCheck) => ({
            ...tx,
            transferDate: this.formatDate(tx.transferDate),
            rawTransferDate: tx.transferDate,
          })
        );

        receivedChecks.forEach((tx) => {
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

        receivedChecks.sort(
          (a, b) =>
            new Date(b.rawTransferDate).getTime() -
            new Date(a.rawTransferDate).getTime()
        );
        this.receivedCheckDataSource.data = receivedChecks;
        this.updatePageSizeOptions();
        this.resetPaginator();
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
      error: (error) => {
        console.error('Error fetching recent receivedChecks:', error);
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
    });
  }

  applyReceivedCheckFilter(): void {
    const filterValue = {
      date: this.receivedCheckFilterDate
        ? this.receivedCheckFilterDate.toISOString()
        : '',
      status: this.receivedCheckFilterStatus
        ? this.receivedCheckFilterStatus
        : '',
      amount: this.receivedCheckFilterAmount
        ? this.receivedCheckFilterAmount
        : '',
      issuer: this.receivedCheckFilterIssuer
        ? this.receivedCheckFilterIssuer
        : '',
      beneficiary: this.receivedCheckFilterBeneficiary
        ? this.receivedCheckFilterBeneficiary
        : '',
    };
    this.receivedCheckDataSource.filter = JSON.stringify(filterValue);
    this.updatePageSizeOptions();
    this.resetPaginator();
  }

  updatePageSizeOptions(): void {
    const count = this.receivedCheckDataSource.filteredData.length;

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
      this.receivedCheckFilterDate ||
      this.receivedCheckFilterAmount ||
      this.receivedCheckFilterStatus ||
      this.receivedCheckFilterIssuer ||
      this.receivedCheckFilterBeneficiary
    );
  }

  closeEndorseForm(): void {
    this.selectedCheckId = null;
  }
  openEndorseForm(checkId: string): void {
    this.selectedCheckId = checkId;
  }

  clearFilterProperty(
    prop: 'status' | 'issuer' | 'date' | 'amount' | 'beneficiary'
  ) {
    switch (prop) {
      case 'status':
        this.receivedCheckFilterStatus = '';
        break;
      case 'issuer':
        this.receivedCheckFilterIssuer = '';
        break;
      case 'date':
        this.receivedCheckFilterDate = null;
        break;
      case 'amount':
        this.receivedCheckFilterAmount = null;
        break;
      case 'beneficiary':
        this.receivedCheckFilterBeneficiary = '';
        break;
    }
    this.applyReceivedCheckFilter();
  }
}
