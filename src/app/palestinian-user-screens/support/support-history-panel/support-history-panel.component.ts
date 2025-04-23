import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Support } from '../../../models/support.model';
import { LoadingService } from '../../../services/loading.service';
import { SupportService } from '../../../services/support.service';
import { SupportHistoryFilterComponent } from '../support-history-filter/support-history-filter.component';
import { CheckRefreshService } from '../../../services/check-refresh.service';

@Component({
  selector: 'app-support-history-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatTooltipModule,
    SupportHistoryFilterComponent,
  ],
  templateUrl: './support-history-panel.component.html',
  styleUrl: './support-history-panel.component.scss',
})
export class SupportHistoryPanelComponent {
  displayedColumns: string[] = [
    'createdAt',
    'supportDescription',
    'supportArea',
    'status',
  ];
  supportDataSource = new MatTableDataSource<Support>();
  dynamicPageSizeOptions: number[] = [5, 10, 15];

  showFilter: boolean = false;
  supportAreaOptions: string[] = [
    'CHECKBOOK',
    'CHECK',
    'ENDORSMENT',
    'SETTLEMENT',
    'GENERAL_SETTING',
  ];
  supportStatusOptions: string[] = ['PENDING', 'RESOLVED'];
  supportFilterArea: string = '';
  supportFilterStatus: string = '';
  supportFilterDate: Date | null = null;

  @ViewChild(MatSort) set sort(ms: MatSort) {
    this.supportDataSource.sort = ms;
    if (this.supportDataSource.paginator) {
      this.supportDataSource.paginator.firstPage();
    }
  }

  @ViewChild(MatPaginator) set paginator(mp: MatPaginator) {
    this.supportDataSource.paginator = mp;
  }

  constructor(
    private supportService: SupportService,
    private loadingService: LoadingService,
    private checkRefreshService: CheckRefreshService
  ) {}

  ngOnInit(): void {
    this.checkRefreshService.refresh$.subscribe(() => {
      this.fetchSupportHistory();
      this.updatePageSizeOptions();
    });
    this.supportDataSource.filterPredicate = (
      data: Support,
      filter: string
    ): boolean => {
      const searchTerms = JSON.parse(filter);
      let areaMatch = true,
        statusMatch = true,
        dateMatch = true;

      if (searchTerms.supportArea) {
        areaMatch = data.supportArea
          .toLowerCase()
          .includes(searchTerms.supportArea.toLowerCase());
      }
      if (searchTerms.status) {
        statusMatch = data.status === searchTerms.status;
      }
      if (searchTerms.date && data.createdAt) {
        const filterDate = new Date(searchTerms.date);
        const dataDate = new Date(data.createdAt);
        dateMatch =
          filterDate.getDate() === dataDate.getDate() &&
          filterDate.getMonth() === dataDate.getMonth() &&
          filterDate.getFullYear() === dataDate.getFullYear();
      }
      return areaMatch && statusMatch && dateMatch;
    };

    this.fetchSupportHistory();
  }

  ngAfterViewInit(): void {
    this.supportDataSource.sort = this.sort;
    this.supportDataSource.paginator = this.paginator;
  }

  fetchSupportHistory(): void {
    this.loadingService.loadingOn();
    this.supportService.getMySupportRequests().subscribe({
      next: (data) => {
        data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.supportDataSource.data = data;
        this.updatePageSizeOptions();
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
      error: (error) => {
        console.error('Error fetching support history', error);
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
    });
  }

  openFilter(): void {
    this.showFilter = true;
  }

  closeFilter(): void {
    this.showFilter = false;
  }

  onFilterApply(filter: any): void {
    this.supportFilterArea = filter.supportArea;
    this.supportFilterStatus = filter.status;
    this.supportFilterDate = filter.date;
    const filterValue = {
      supportArea: this.supportFilterArea,
      status: this.supportFilterStatus,
      date: this.supportFilterDate ? this.supportFilterDate.toISOString() : '',
    };
    this.supportDataSource.filter = JSON.stringify(filterValue);
    this.updatePageSizeOptions();
    this.closeFilter();
  }

  clearFilter(): void {
    this.supportFilterArea = '';
    this.supportFilterStatus = '';
    this.supportFilterDate = null;
    this.supportDataSource.filter = JSON.stringify({
      supportArea: '',
      status: '',
      date: '',
    });
    this.updatePageSizeOptions();
  }

  hasActiveFilter(): boolean {
    return !!(
      this.supportFilterArea ||
      this.supportFilterStatus ||
      this.supportFilterDate
    );
  }

  updatePageSizeOptions(): void {
    const count = this.supportDataSource.filteredData.length;
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
  

  transformEnumValue(value: string): string {
    return value
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (match) => match.toUpperCase());
  }
}
