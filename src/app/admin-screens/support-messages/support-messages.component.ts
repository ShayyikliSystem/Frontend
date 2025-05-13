import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AdminService } from '../../services/admin.service';
import { Support } from '../../models/support.model';
import { ReplyPerUserComponent } from './reply-per-user/reply-per-user.component';
import { AlertComponent } from '../../alert/alert.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SupportMessagesFilterComponent } from './support-messages-filter/support-messages-filter.component';
import { LoadingService } from '../../services/loading.service';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-support-messages',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    ReplyPerUserComponent,
    SupportMessagesFilterComponent,
    AlertComponent,
    MatTooltipModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './support-messages.component.html',
  styleUrl: './support-messages.component.scss',
})
export class SupportMessagesComponent implements OnInit, AfterViewInit {
  displayedColumns = [
    'id',
    'accountNumber',
    'userName',
    'supportArea',
    'supportDescription',
    'status',
    'createdAt',
    'actions',
  ];

  showResponse = false;
  currentId!: number;
  currentDesc = '';

  showAlert = false;
  alertMessage = '';
  alertType: 'success' | 'error' = 'success';

  showFilter = false;
  filterValues = {
    supportArea: '',
    status: '',
    date: null as Date | null,
  };

  supportAreaOptions = [
    'CHECKBOOK',
    'CHECK',
    'ENDORSMENT',
    'SETTLEMENT',
    'GENERAL_SETTING',
  ];

  statusOptions = ['PENDING', 'RESOLVED'];

  dataSource = new MatTableDataSource<Support>([]);

  dynamicPageSizeOptions: number[] = [5, 10, 15];

  @ViewChild(MatSort) set sort(ms: MatSort) {
    this.dataSource.sort = ms;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  @ViewChild(MatPaginator) set paginator(mp: MatPaginator) {
    this.dataSource.paginator = mp;
  }

  constructor(
    private adminService: AdminService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.adminService.getAllSupportRequests().subscribe({
      next: (data: Support[]) => {
        this.loadingService.loadingOn();
        data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.dataSource.data = data;

        this.setupFilterPredicate();
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
      error: (err) => {
        console.error('Error loading support requests', err);
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
    });
  }

  onFilterCancel() {
    this.showFilter = false;
  }

  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  onFilterApply(f: typeof this.filterValues) {
    const serialized = {
      supportArea: f.supportArea,
      status: f.status,
      date: f.date ? f.date.toISOString() : null,
    };

    this.filterValues = { ...f };
    this.dataSource.filter = JSON.stringify(serialized);
    this.showFilter = false;
  }

  clearFilter() {
    this.filterValues = { supportArea: '', status: '', date: null };
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }
  hasActiveFilter(): boolean {
    const f = this.filterValues;
    return !!(f.supportArea || f.status || f.date);
  }

  private setupFilterPredicate() {
    this.dataSource.filterPredicate = (data: Support, filter: string) => {
      const f = JSON.parse(filter) as {
        supportArea: string;
        status: string;
        date: string | null;
      };

      const areaMatch = f.supportArea
        ? data.supportArea === f.supportArea
        : true;
      const statusMatch = f.status ? data.status === f.status : true;

      let dateMatch = true;
      if (f.date) {
        const filterDate = new Date(f.date);
        const dataDate = new Date(data.createdAt);
        dateMatch =
          filterDate.getFullYear() === dataDate.getFullYear() &&
          filterDate.getMonth() === dataDate.getMonth() &&
          filterDate.getDate() === dataDate.getDate();
      }

      return areaMatch && statusMatch && dateMatch;
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  transformEnumValue(value: string): string {
    return value
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  }

  onReply(x: Support) {
    this.currentId = x.id;
    this.currentDesc = x.supportDescription;
    this.showResponse = true;
  }

  onReplied() {
    this.alertMessage = 'Reply sent successfully.';
    this.alertType = 'success';
    this.showAlert = true;
    this.showResponse = false;
    this.ngOnInit();
  }

  onClosed() {
    this.showResponse = false;
  }

  clearFilterProperty(prop: 'supportArea' | 'status' | 'date') {
    switch (prop) {
      case 'supportArea':
        this.filterValues.supportArea = '';
        break;
      case 'status':
        this.filterValues.status = '';
        break;
      case 'date':
        this.filterValues.date = null;
        break;
    }

    // re-serialize and re-apply
    const serialized = {
      supportArea: this.filterValues.supportArea,
      status: this.filterValues.status,
      date: this.filterValues.date
        ? this.filterValues.date.toISOString()
        : null,
    };
    this.dataSource.filter = JSON.stringify(serialized);
  }
}
