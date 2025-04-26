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
  ],
  templateUrl: './contact-requests.component.html',
  styleUrl: './contact-requests.component.scss',
})
export class ContactRequestsComponent implements OnInit, AfterViewInit {
  displayedColumns = [
    'id',
    'name',
    'email',
    'phoneNumber',
    'message',
    'status', // ← added
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

  @ViewChild(MatSort) set sort(ms: MatSort) {
    this.dataSource.sort = ms;
    this.dataSource.paginator?.firstPage();
  }
  @ViewChild(MatPaginator) set paginator(mp: MatPaginator) {
    this.dataSource.paginator = mp;
  }

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.contactService.getAllContacts().subscribe({
      next: (data) => {
        console.log(data);
        data.sort((a, b) => b.id - a.id);
        this.dataSource.data = data;
        this.updatePageSizeOptions();
      },
      error: (err) => {
        console.error('Error loading contacts', err);
      },
    });
  }

  ngAfterViewInit(): void {}

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

  transformEnumValue(value?: string): string {
    if (!value) return '';
    return value
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  onReply(row: any) {
    if (row.status !== 'PENDING') {
      return;
    }
    this.currentId = row.id;
    this.currentMessage = row.message;
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
