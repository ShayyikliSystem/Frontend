import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CheckRefreshService } from '../../../services/check-refresh.service';
import { CheckbookService } from '../../../services/checkbook.service';
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
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-checkbook-history-per-user',
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
  ],
  templateUrl: './checkbook-history-per-user.component.html',
  styleUrl: './checkbook-history-per-user.component.scss',
})
export class CheckbookHistoryPerUserComponent
  implements AfterViewInit, OnChanges
{
  @Input() accountNumber!: number;

  checkbookDisplayedColumns: string[] = [
    'checkbookid',
    'issuedTotalChecks',
    'returnedchecks',
    'remainingChecks',
    'issuedAt',
    'status',
  ];
  checkbookDataSource = new MatTableDataSource<any>();
  dynamicPageSizeOptions: number[] = [5, 10, 15];
  classification: any = 'N/A';
  hasActiveCheckbook: boolean = false;

  @ViewChild(MatSort) set sort(ms: MatSort) {
    this.checkbookDataSource.sort = ms;
    if (this.checkbookDataSource.paginator) {
      this.checkbookDataSource.paginator.firstPage();
    }
  }

  @ViewChild(MatPaginator) set paginator(mp: MatPaginator) {
    this.checkbookDataSource.paginator = mp;
  }

  constructor(
    private adminService: AdminService,
    private checkbookService: CheckbookService,
    private loadingService: LoadingService,
    private checkRefreshService: CheckRefreshService,
    private userService: UserService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['accountNumber'] &&
      changes['accountNumber'].currentValue !== undefined
    ) {
      this.fetchCheckbookHistory();
      this.loadUserData();

      this.checkRefreshService.refresh$.subscribe(() => {
        this.fetchCheckbookHistory();
      });

      this.loadingService.loadingOn();
      this.checkbookService.hasActiveCheckbook().subscribe({
        next: (data) => {
          this.hasActiveCheckbook = data;
        },
        error: (err) => {
          console.error('Error fetching active checkbook status', err);
          setTimeout(() => {
            this.loadingService.loadingOff();
          }, 400);
        },
      });
    }
  }

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

  ngAfterViewInit(): void {
    this.checkbookDataSource.sort = this.sort;
    this.checkbookDataSource.paginator = this.paginator;
  }

  fetchCheckbookHistory(): void {
    this.loadingService.loadingOn();
    this.adminService
      .getCheckbookHistoryByAccount(this.accountNumber)
      .subscribe({
        next: (data) => {
          const checkbooks = Array.isArray(data[0]) ? data[0] : data;
          checkbooks.sort(
            (a: any, b: any) =>
              new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime()
          );
          this.checkbookDataSource.data = checkbooks;
          this.updatePageSizeOptions();
          setTimeout(() => {
            this.loadingService.loadingOff();
          }, 400);
        },
        error: (error) => {
          console.error('Error fetching checkbook history', error);
          setTimeout(() => {
            this.loadingService.loadingOff();
          }, 400);
        },
      });
  }

  updatePageSizeOptions(): void {
    const totalItems = this.checkbookDataSource.paginator
      ? this.checkbookDataSource.paginator.length
      : this.checkbookDataSource.filteredData.length;

    const pageSize = this.checkbookDataSource.paginator
      ? this.checkbookDataSource.paginator.pageSize
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

  formatDate(dateString: string): string {
    if (!dateString) return 'Invalid Date';
    const date = new Date(dateString);

    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  }
}
