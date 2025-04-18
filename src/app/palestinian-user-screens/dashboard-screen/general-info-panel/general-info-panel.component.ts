import { Component } from '@angular/core';
import { LoadingService } from '../../../services/loading.service';
import { UserService } from '../../../services/user.service';
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
  selector: 'app-general-info-panel',
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
  templateUrl: './general-info-panel.component.html',
  styleUrl: './general-info-panel.component.scss',
})
export class GeneralInfoPanelComponent {
  balance: any = 'N/A';
  returnedChecks: any = 'N/A';
  issuedChecks: any = 'N/A';
  classification: any = 'N/A';

  constructor(
    private userService: UserService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.loadingService.loadingOn();
    this.userService.getUserBalance().subscribe({
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
    this.userService.getReturnedChecksCount().subscribe({
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
    this.userService.getIssuedChecksCount().subscribe({
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
}
