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
import { CheckbookService } from '../../../services/checkbook.service';
import { LoadingService } from '../../../services/loading.service';
import { CheckRefreshService } from '../../../services/check-refresh.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-checkbook-history-panel',
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
  templateUrl: './checkbook-history-panel.component.html',
  styleUrl: './checkbook-history-panel.component.scss',
})
export class CheckbookHistoryPanelComponent implements OnInit, AfterViewInit {
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
    private checkbookService: CheckbookService,
    private loadingService: LoadingService,
    private checkRefreshService: CheckRefreshService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
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
    this.checkbookService.getCheckbookHistory().subscribe({
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
    const count = this.checkbookDataSource.filteredData.length;
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
    }).format(date);
  }
}
