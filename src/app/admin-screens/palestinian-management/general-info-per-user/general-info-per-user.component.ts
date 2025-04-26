import { AdminService } from './../../../services/admin.service';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { LoadingService } from '../../../services/loading.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-general-info-per-user',
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
  ],
  templateUrl: './general-info-per-user.component.html',
  styleUrl: './general-info-per-user.component.scss',
})
export class GeneralInfoPerUserComponent implements OnChanges {
  @Input() accountNumber!: number;

  balance: any = 'N/A';
  returnedChecks: any = 'N/A';
  issuedChecks: any = 'N/A';
  classification: any = 'N/A';

  constructor(
    private adminService: AdminService,
    private loadingService: LoadingService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['accountNumber'] &&
      changes['accountNumber'].currentValue !== undefined
    ) {
      this.loadUserData();
    }
  }

  loadUserData(): void {
    this.loadingService.loadingOn();
    this.adminService.getBalance(this.accountNumber).subscribe({
      next: (data) => {
        this.balance = data;
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
      error: (err) => {
        console.error('Error fetching balance', err);
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
    });

    this.loadingService.loadingOn();
    this.adminService
      .getReturnedChecksCountByAccount(this.accountNumber)
      .subscribe({
        next: (data) => {
          this.returnedChecks = data;
          setTimeout(() => {
            this.loadingService.loadingOff();
          }, 400);
        },
        error: (err) => {
          console.error('Error fetching returned digital checks count', err);
          setTimeout(() => {
            this.loadingService.loadingOff();
          }, 400);
        },
      });

    this.loadingService.loadingOn();
    this.adminService
      .getIssuedChecksCountByAccount(this.accountNumber)
      .subscribe({
        next: (data) => {
          this.issuedChecks = data;
          setTimeout(() => {
            this.loadingService.loadingOff();
          }, 400);
        },
        error: (err) => {
          console.error('Error fetching issued digital checks count', err);
          setTimeout(() => {
            this.loadingService.loadingOff();
          }, 400);
        },
      });

    this.loadingService.loadingOn();
    this.adminService.getClassificationByAccount(this.accountNumber).subscribe({
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
}
