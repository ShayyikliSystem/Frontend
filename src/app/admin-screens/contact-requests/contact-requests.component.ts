import { LoadingService } from './../../services/loading.service';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AlertComponent } from '../../alert/alert.component';
import { AdminService } from '../../services/admin.service';
import { ContactService } from '../../services/contact.service';
import { ReplyToContactComponent } from './reply-to-contact/reply-to-contact.component';
import { ContactRequestsFilterComponent } from './contact-requests-filter/contact-requests-filter.component';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-contact-requests',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    AlertComponent,
    ReplyToContactComponent,
    ContactRequestsFilterComponent,
    MatTooltipModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './contact-requests.component.html',
  styleUrl: './contact-requests.component.scss',
})
export class ContactRequestsComponent implements OnInit {
  displayedColumns = [
    'id',
    'name',
    'email',
    'phoneNumber',
    'message',
    'status',
    'actions',
  ];
  dataSource = new MatTableDataSource<any>([]);
  dynamicPageSizeOptions: number[] = [5, 10, 15];

  showResponse = false;
  currentId!: number;
  currentMessage = '';

  showAlert = false;
  alertMessage = '';
  alertType: 'success' | 'error' = 'success';

  showFilter = false;
  filterStatus = '';
  statusOptions = ['PENDING', 'RESOLVED'];

  @ViewChild(MatSort) set sort(ms: MatSort) {
    this.dataSource.sort = ms;
    this.resetPaginator();
  }

  private _paginator!: MatPaginator;

  @ViewChild(MatPaginator) set paginator(mp: MatPaginator) {
    this._paginator = mp;
    this.dataSource.paginator = mp;
  }

  constructor(
    private contactService: ContactService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadContacts();

    this.dataSource.filterPredicate = (row: any, filter: string) =>
      !filter || row.status === filter;
  }

  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  onFilterApply(status: string) {
    this.filterStatus = status;
    this.dataSource.filter = status;
    this.showFilter = false;
  }

  onFilterCancel() {
    this.showFilter = false;
  }

  clearFilter() {
    this.filterStatus = '';
    this.dataSource.filter = '';
  }

  hasActiveFilter(): boolean {
    return !!this.filterStatus;
  }

  private loadContacts(): void {
    this.contactService.getAllContacts().subscribe({
      next: (data) => {
        this.loadingService.loadingOn();
        data.sort((a, b) => b.id - a.id);

        this.dataSource.data = data;
        this.updatePageSizeOptions();
        this.resetPaginator();
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
      error: (err) => {
        console.error('Error loading contacts', err);
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
    });
  }

  onReply(row: any) {
    if (row.status !== 'PENDING') return;
    this.currentId = row.id;
    this.currentMessage = row.message;
    this.showResponse = true;
  }

  onReplied() {
    this.alertMessage = 'Reply sent successfully.';
    this.alertType = 'success';
    this.showAlert = true;
    this.showResponse = false;
    this.loadContacts();
  }

  onClosed() {
    this.showResponse = false;
  }

  updatePageSizeOptions(): void {
    const count = this.dataSource.filteredData.length;

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

  transformEnumValue(value?: string): string {
    if (!value) return '';
    return value
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  clearFilterProperty(prop: 'status') {
    if (prop === 'status') {
      this.filterStatus = '';
      this.dataSource.filter = '';
    }
  }
}
