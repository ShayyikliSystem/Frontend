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

@Component({
  selector: 'app-support-messages',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    ReplyPerUserComponent,
    SupportMessagesFilterComponent,
    AlertComponent,
    MatTooltipModule,
    MatIconModule,
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

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getAllSupportRequests().subscribe({
      next: (data: Support[]) => {
        console.log(data);
        data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.dataSource.data = data;

        this.updatePageSizeOptions();

        this.setupFilterPredicate();
      },
      error: (err) => {
        console.error('Error loading support requests', err);
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
      // parse the JSON; f.date will be a string if set, or null
      const f = JSON.parse(filter) as {
        supportArea: string;
        status: string;
        date: string | null;
      };

      // area & status
      const areaMatch = f.supportArea
        ? data.supportArea === f.supportArea
        : true;
      const statusMatch = f.status ? data.status === f.status : true;

      // date:
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

  private updatePageSizeOptions(): void {
    const total = this.dataSource.data.length;
    if (total < 5) {
      this.dynamicPageSizeOptions = [total];
      return;
    }
    const opts: number[] = [];
    for (let i = 5; i <= total; i += 5) {
      opts.push(i);
    }
    if (opts[opts.length - 1] !== total) {
      opts.push(total);
    }
    this.dynamicPageSizeOptions = opts;
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
    console.log(x);
    this.currentId = x.id;
    this.currentDesc = x.supportDescription;
    this.showResponse = true;
  }

  onReplied() {
    this.alertMessage = 'Reply sent successfully!';
    this.alertType = 'success';
    this.showAlert = true;

    this.showResponse = false;
    this.ngOnInit();
  }

  onClosed() {
    this.showResponse = false;
  }
}
