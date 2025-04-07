import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { LoadingService } from '../../services/loading.service';
import { TransactionsPanelComponent } from './transactions-panel/transactions-panel.component';
import { GeneralInfoPanelComponent } from './general-info-panel/general-info-panel.component';

@Component({
  selector: 'app-dashboard-screen',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TransactionsPanelComponent,
    GeneralInfoPanelComponent,
  ],
  templateUrl: './dashboard-screen.component.html',
  styleUrl: './dashboard-screen.component.css',
})
export class DashboardScreenComponent {
  userFullName: string = 'N/A';
  shayyikliAccountNumber: string | null = null;
  currentDate: Date = new Date();

  constructor(
    private userService: UserService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.shayyikliAccountNumber = localStorage.getItem(
      'shayyikliAccountNumber'
    );

    if (this.shayyikliAccountNumber) {
      const accountNumber = Number(this.shayyikliAccountNumber);
      this.loadingService.loadingOn();
      this.userService.getUserDetailsByAccountNumber(accountNumber).subscribe({
        next: (userData) => {
          this.userFullName = userData.firstName;
          setTimeout(() => {
            this.loadingService.loadingOff();
          }, 400);
        },
        error: (error) => {
          console.error('Error fetching user details', error);
          setTimeout(() => {
            this.loadingService.loadingOff();
          }, 400);
        },
      });
    }
  }
}
