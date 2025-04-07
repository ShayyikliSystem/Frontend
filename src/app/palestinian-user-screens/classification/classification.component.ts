import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from '../../alert/alert.component';
import { AuthService } from '../../services/auth.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-classification',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
  ],
  templateUrl: './classification.component.html',
  styleUrl: './classification.component.scss',
})
export class ClassificationComponent {
  balance: any = 'N/A';
  returnedChecks: any = 'N/A';
  issuedChecks: any = 'N/A';
  classification: any = 'N/A';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.userService.getUserBalance().subscribe({
      next: (data) => (this.balance = data),
      error: (err) => console.error('Error fetching balance', err),
    });

    this.userService.getReturnedChecksCount().subscribe({
      next: (data) => (this.returnedChecks = data),
      error: (err) =>
        console.error('Error fetching returned checks count', err),
    });

    this.userService.getIssuedChecksCount().subscribe({
      next: (data) => (this.issuedChecks = data),
      error: (err) => console.error('Error fetching issued checks count', err),
    });

    this.userService.getUserClassification().subscribe({
      next: (data) => (this.classification = data),
      error: (err) => console.error('Error fetching classification', err),
    });
  }
}
