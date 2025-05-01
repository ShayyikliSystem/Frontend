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
    AlertComponent,
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
      },
      error: (err) => {
        console.error('Error loading support requests', err);
      },
    });
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
    this.alertMessage = 'Reply sent successfully.';
    this.alertType = 'success';
    this.showAlert = true;

    this.showResponse = false;
    this.ngOnInit();
  }

  onClosed() {
    this.showResponse = false;
  }
}
