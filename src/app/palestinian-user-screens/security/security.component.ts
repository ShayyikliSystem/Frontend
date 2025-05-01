import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  effect,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from '../../alert/alert.component';
import { AuthService } from '../../services/auth.service';
import { ConfirmResetComponent } from '../settings/confirm-reset/confirm-reset.component';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { LoadingService } from '../../services/loading.service';
import { SecurityFilterComponent } from './security-filter/security-filter.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AlertComponent,
    ConfirmResetComponent,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatExpansionModule,
    SecurityFilterComponent,
    MatTooltipModule,
  ],
  templateUrl: './security.component.html',
  styleUrl: './security.component.scss',
})
export class SecurityComponent implements OnInit, AfterViewInit {
  alertMessage = '';
  alertType: 'success' | 'error' = 'success';

  displayedColumns: string[] = ['status', 'date', 'location_name'];
  dataSource = new MatTableDataSource<any>();
  loginHistory: any[] = [];

  filterStatus: string = '';
  filterDate: Date | null = null;
  showFilter: boolean = false;

  showResetPassword: boolean = false;
  showWarning: boolean = false;

  dynamicPageSizeOptions: number[] = [5, 10, 15, 20, 25];

  @ViewChild(MatSort) set sort(ms: MatSort) {
    this.dataSource.sort = ms;
  }

  @ViewChild(MatPaginator) set paginator(mp: MatPaginator) {
    this.dataSource.paginator = mp;
  }

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.fetchLoginHistory();

    this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
      const searchTerms = JSON.parse(filter);

      const statusMatch = searchTerms.status
        ? data.status === searchTerms.status.toLowerCase()
        : true;

      let dateMatch = true;
      if (searchTerms.date && data.rawDate) {
        const filterDate = new Date(searchTerms.date);
        const dataDate = new Date(data.rawDate);

        dateMatch =
          filterDate.getDate() === dataDate.getDate() &&
          filterDate.getMonth() === dataDate.getMonth() &&
          filterDate.getFullYear() === dataDate.getFullYear();
      }

      return statusMatch && dateMatch;
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  showAlert(message: string, type: 'success' | 'error' = 'success'): void {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => (this.alertMessage = ''), 5000);
  }

  onResetPassword(): void {
    this.showResetPassword = true;
  }

  confirmResetPassword(): void {
    this.showResetPassword = false;
    this.loadingService.loadingOn();
    this.authService.resetPasswordForProfile().subscribe({
      next: () => {
        this.showAlert(
          'Your password has been reset successfully, Logging out in 5 seconds...',
          'success'
        );
        this.loadingService.loadingOff();
        setTimeout(() => {
          this.authService.logout();
        }, 5000);
      },
      error: (err) => {
        console.error('Password reset failed', err);
        this.showAlert(
          `Error resetting password: ${
            err.error?.message || 'Something went wrong'
          }`,
          'error'
        );
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
    });
  }

  cancelResetPassword(): void {
    this.showResetPassword = false;
  }

  openFilter(): void {
    this.showFilter = true;
  }

  closeFilter(): void {
    this.showFilter = false;
  }

  clearFilter(): void {
    this.resetFilters();
    this.showFilter = false;
  }

  onFilterApply(filter: { status: string; date: Date | null }): void {
    this.filterStatus = filter.status;
    this.filterDate = filter.date;
    this.applyFilter();
    this.showFilter = false;
  }

  hasActiveFilter(): boolean {
    return !!this.filterStatus || !!this.filterDate;
  }

  fetchLoginHistory(): void {
    this.loadingService.loadingOn();
    this.authService.getLoginHistory().subscribe({
      next: (data) => {
        let failedAttempts = 0;
        this.loginHistory = data.map((log: any) => {
          const status =
            typeof log.status === 'object' && log.status.name
              ? log.status.name.toLowerCase()
              : String(log.status).toLowerCase();

          if (status === 'failed') {
            failedAttempts++;
          }

          return {
            ...log,
            status,
            date: this.formatDate(log.date),
            rawDate: log.date,
          };
        });

        this.loginHistory.sort((a, b) => {
          const dateA = new Date(a.rawDate).getTime();
          const dateB = new Date(b.rawDate).getTime();
          return dateB - dateA;
        });

        this.dataSource.data = this.loginHistory;
        this.showWarning = failedAttempts > 3;

        this.updatePageSizeOptions();
        this.resetPaginator();
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
      error: (error) => {
        console.error('Error fetching login history:', error);
        this.showAlert(
          `Error fetching login history: ${
            error.error?.message || 'Something went wrong'
          }`,
          'error'
        );
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
    });
  }

  updatePageSizeOptions(): void {
    const count = this.dataSource.filteredData.length;

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

  applyFilter(): void {
    const filterValue = {
      status: this.filterStatus,
      date: this.filterDate ? this.filterDate.toISOString() : '',
    };
    this.dataSource.filter = JSON.stringify(filterValue);
    this.updatePageSizeOptions();
    this.resetPaginator();
  }

  resetFilters(): void {
    this.filterStatus = '';
    this.filterDate = null;
    this.applyFilter();
  }

  resetPaginator(): void {
    if (this.paginator) {
      this.paginator.firstPage();
      this.paginator.pageSize = this.dynamicPageSizeOptions[0];
    }
  }
}
