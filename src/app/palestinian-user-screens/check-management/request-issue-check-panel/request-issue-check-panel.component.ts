import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RequestIssueCheckFormComponent } from '../request-issue-check-form/request-issue-check-form.component';
import { CheckbookService } from '../../../services/checkbook.service';
import { LoadingService } from '../../../services/loading.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-request-issue-check-panel',
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
    RequestIssueCheckFormComponent,
  ],
  templateUrl: './request-issue-check-panel.component.html',
  styleUrl: './request-issue-check-panel.component.scss',
})
export class RequestIssueCheckPanelComponent implements OnInit {
  showRequestCheckOverlay: boolean = false;
  hasActiveCheckbook: boolean = false;

  classification: any = 'N/A';

  constructor(
    private checkbookService: CheckbookService,
    private loadingService: LoadingService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
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
    this.checkbookService.hasActiveCheckbook().subscribe({
      next: (data) => {
        this.hasActiveCheckbook = data;
      },
      error: (err) => {
        console.error('Error checking active checkbook', err);
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
    });
  }

  openRequestCheck(): void {
    this.showRequestCheckOverlay = true;
  }

  cancelRequestCheck(): void {
    this.showRequestCheckOverlay = false;
  }
}
